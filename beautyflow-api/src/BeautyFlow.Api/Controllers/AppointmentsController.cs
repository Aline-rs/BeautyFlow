using BeautyFlow.Api.Contracts;
using BeautyFlow.Api.Contracts.Appointments;
using BeautyFlow.Application.Abstractions.Appointments;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Application.Models.Appointments;
using BeautyFlow.Domain.Entities;
using BeautyFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Api.Controllers;

[ApiController]
[Authorize]
[Route("appointments")]
public sealed class AppointmentsController : ControllerBase
{
    private readonly BeautyFlowDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAppointmentService _appointmentService;

    public AppointmentsController(
        BeautyFlowDbContext dbContext,
        ICurrentUserService currentUserService,
        IAppointmentService appointmentService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _appointmentService = appointmentService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AppointmentDto>> CreateAppointment([FromBody] CreateAppointmentRequest request)
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (!Guid.TryParse(request.CustomerId, out var customerId) ||
            !Guid.TryParse(request.ServiceId, out var serviceId) ||
            !DateOnly.TryParse(request.AppointmentDate, out var appointmentDate))
        {
            return BadRequest(ApiResponse<object>.Failure("Invalid appointment payload."));
        }

        try
        {
            var result = await _appointmentService.RegisterAppointmentAsync(
                salonId.Value,
                new CreateAppointmentInput
                {
                    CustomerId = customerId,
                    ServiceId = serviceId,
                    AppointmentDate = appointmentDate,
                    Notes = request.Notes
                });

            var createdAppointment = await LoadAppointmentAsync(result.AppointmentId, salonId.Value);
            return CreatedAtAction(nameof(GetAppointments), new { id = result.AppointmentId }, MapAppointment(createdAppointment!));
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(ApiResponse<object>.Failure(exception.Message));
        }
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<AppointmentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<AppointmentDto>>> GetAppointments([FromQuery] string? search)
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var query = _dbContext.Appointments
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Service)
            .Include(x => x.ScheduledMessage)
            .Where(x => x.SalonId == salonId.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim().ToLowerInvariant();
            query = query.Where(x =>
                EF.Functions.ILike(x.Customer.Name, $"%{normalizedSearch}%") ||
                EF.Functions.ILike(x.Service.Name, $"%{normalizedSearch}%"));
        }

        var appointments = await query
            .OrderByDescending(x => x.AppointmentDate)
            .ThenByDescending(x => x.CreatedAtUtc)
            .ToListAsync();

        return Ok(appointments.Select(MapAppointment).ToList());
    }

    private Guid? GetSalonId()
    {
        return _currentUserService.SalonId;
    }

    private async Task<Appointment?> LoadAppointmentAsync(Guid appointmentId, Guid salonId)
    {
        return await _dbContext.Appointments
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Service)
            .Include(x => x.ScheduledMessage)
            .FirstOrDefaultAsync(x => x.Id == appointmentId && x.SalonId == salonId);
    }

    private static AppointmentDto MapAppointment(Appointment appointment)
    {
        return new AppointmentDto
        {
            Id = appointment.Id.ToString(),
            CustomerId = appointment.CustomerId.ToString(),
            CustomerName = appointment.Customer.Name,
            ServiceId = appointment.ServiceId.ToString(),
            ServiceName = appointment.Service.Name,
            AppointmentDate = appointment.AppointmentDate.ToString("yyyy-MM-dd"),
            Notes = appointment.Notes,
            ScheduledMessageId = appointment.ScheduledMessage?.Id.ToString() ?? string.Empty,
            ScheduledForDate = appointment.ScheduledMessage?.ScheduledForDate.ToString("yyyy-MM-dd") ?? string.Empty,
            MessageStatus = CustomersController.MapMessageStatusLabel(appointment.ScheduledMessage?.Status),
            MessageText = appointment.ScheduledMessage?.MessageText ?? string.Empty
        };
    }
}
