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
        Guid userId,
        Guid? salonId,
        CreateAppointmentInput input,
        CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken)
            ?? throw new InvalidOperationException("User was not found.");

        var customer = await _dbContext.Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == input.CustomerId && x.UserId == userId,
                cancellationToken);

        if (customer is null)
        {
            throw new InvalidOperationException("Customer was not found.");
        }

        var service = await _dbContext.Services
            .AsNoTracking()
            .Where(x => input.ServiceIds.Contains(x.Id) && x.UserId == userId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        if (service.Count != input.ServiceIds.Count)
        {
            throw new InvalidOperationException("One or more services were not found.");
        }

        var triggerService = service
            .OrderByDescending(x => x.SuggestedReturnDays)
            .ThenBy(x => x.Name)
            .First();

        Salon? salon = null;
        var effectiveSalonId = salonId ?? customer.SalonId;

        if (effectiveSalonId is not null)
        {
            salon = await _dbContext.Salons
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == effectiveSalonId.Value, cancellationToken)
                ?? throw new InvalidOperationException("Salon was not found.");
        }

        var scheduledForDate = input.AppointmentDate.AddDays(triggerService.SuggestedReturnDays);
        var messageText = _messageTemplateRenderer.RenderFollowUpMessage(
            salon?.Name ?? user.Name,
            customer.Name,
            triggerService.Name,
            triggerService.SuggestedReturnDays,
            input.AppointmentDate);

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var appointment = new Appointment
        {
            UserId = userId,
            SalonId = effectiveSalonId,
            CustomerId = customer.Id,
            ServiceId = triggerService.Id,
            AppointmentDate = input.AppointmentDate,
            Notes = string.IsNullOrWhiteSpace(input.Notes) ? null : input.Notes.Trim()
        };

        _dbContext.Appointments.Add(appointment);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var appointmentServices = service
            .Select((item, index) => new Domain.Entities.AppointmentService
            {
                UserId = userId,
                AppointmentId = appointment.Id,
                CustomerId = customer.Id,
                ServiceId = item.Id,
                SalonId = effectiveSalonId,
                AppointmentDate = input.AppointmentDate,
                SuggestedReturnDays = item.SuggestedReturnDays,
                SortOrder = index
            })
            .ToList();

        _dbContext.AppointmentServices.AddRange(appointmentServices);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var scheduledMessage = new ScheduledMessage
        {
            UserId = userId,
            SalonId = effectiveSalonId,
            AppointmentId = appointment.Id,
            CustomerId = customer.Id,
            ServiceId = triggerService.Id,
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
