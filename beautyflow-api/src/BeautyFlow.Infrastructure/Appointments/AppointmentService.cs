using BeautyFlow.Application.Abstractions.Appointments;
using BeautyFlow.Application.Abstractions.Messaging;
using BeautyFlow.Application.Models.Appointments;
using BeautyFlow.Domain.Entities;
using BeautyFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Infrastructure.Appointments;

public sealed class AppointmentService : IAppointmentService
{
    private readonly BeautyFlowDbContext _dbContext;
    private readonly IMessageTemplateRenderer _messageTemplateRenderer;

    public AppointmentService(
        BeautyFlowDbContext dbContext,
        IMessageTemplateRenderer messageTemplateRenderer)
    {
        _dbContext = dbContext;
        _messageTemplateRenderer = messageTemplateRenderer;
    }

    public async Task<AppointmentRegistrationResult> RegisterAppointmentAsync(
        Guid salonId,
        CreateAppointmentInput input,
        CancellationToken cancellationToken = default)
    {
        var customer = await _dbContext.Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == input.CustomerId && x.SalonId == salonId,
                cancellationToken);

        if (customer is null)
        {
            throw new InvalidOperationException("Customer was not found.");
        }

        var service = await _dbContext.Services
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == input.ServiceId && x.SalonId == salonId,
                cancellationToken);

        if (service is null)
        {
            throw new InvalidOperationException("Service was not found.");
        }

        var salon = await _dbContext.Salons
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == salonId, cancellationToken)
            ?? throw new InvalidOperationException("Salon was not found.");

        var scheduledForDate = input.AppointmentDate.AddDays(service.SuggestedReturnDays);
        var messageText = _messageTemplateRenderer.RenderFollowUpMessage(
            salon.Name,
            customer.Name,
            service.Name,
            service.SuggestedReturnDays,
            input.AppointmentDate);

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var appointment = new Appointment
        {
            SalonId = salonId,
            CustomerId = customer.Id,
            ServiceId = service.Id,
            AppointmentDate = input.AppointmentDate,
            Notes = string.IsNullOrWhiteSpace(input.Notes) ? null : input.Notes.Trim()
        };

        _dbContext.Appointments.Add(appointment);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var scheduledMessage = new ScheduledMessage
        {
            SalonId = salonId,
            AppointmentId = appointment.Id,
            CustomerId = customer.Id,
            ServiceId = service.Id,
            ScheduledForDate = scheduledForDate,
            MessageText = messageText
        };

        _dbContext.ScheduledMessages.Add(scheduledMessage);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return new AppointmentRegistrationResult
        {
            AppointmentId = appointment.Id,
            ScheduledMessageId = scheduledMessage.Id,
            ScheduledForDate = scheduledForDate,
            MessageText = messageText
        };
    }
}
