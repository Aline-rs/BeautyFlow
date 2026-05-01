using BeautyFlow.Api.Contracts;
using BeautyFlow.Api.Contracts.Appointments;
using BeautyFlow.Application.Abstractions.Appointments;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Application.Models.Appointments;
using BeautyFlow.Domain.Entities;
using BeautyFlow.Domain.Enums;
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
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        Guid? salonId = null;
        var selectedSalonId = _currentUserService.SelectedSalonId;
        if (selectedSalonId is not null)
        {
            var isLinked = await _dbContext.UserSalons.AnyAsync(x => x.UserId == userId.Value && x.SalonId == selectedSalonId.Value);
            if (!isLinked)
            {
                return Forbid();
            }

            salonId = selectedSalonId.Value;
        }

        var serviceIds = request.ServiceIds
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => Guid.TryParse(x, out var parsedId) ? parsedId : Guid.Empty)
            .Where(x => x != Guid.Empty)
            .Distinct()
            .ToList();

        if (!Guid.TryParse(request.CustomerId, out var customerId) ||
            serviceIds.Count == 0 ||
            !DateOnly.TryParse(request.AppointmentDate, out var appointmentDate))
        {
            return BadRequest(ApiResponse<object>.Failure("Invalid appointment payload."));
        }

        try
        {
            var result = await _appointmentService.RegisterAppointmentAsync(
                userId.Value,
                salonId,
                new CreateAppointmentInput
                {
                    CustomerId = customerId,
                    ServiceIds = serviceIds,
                    AppointmentDate = appointmentDate,
                    Notes = request.Notes
                });

            var createdAppointment = await LoadAppointmentAsync(result.AppointmentId, userId.Value);
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
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var query = _dbContext.Appointments
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Salon)
            .Include(x => x.Service)
            .Include(x => x.AppointmentServices)
                .ThenInclude(x => x.Service)
            .Include(x => x.ScheduledMessage)
            .Where(x => x.UserId == userId.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim().ToLowerInvariant();
            query = query.Where(x =>
                EF.Functions.ILike(x.Customer.Name, $"%{normalizedSearch}%") ||
                EF.Functions.ILike(x.Service.Name, $"%{normalizedSearch}%") ||
                x.AppointmentServices.Any(link => EF.Functions.ILike(link.Service.Name, $"%{normalizedSearch}%")));
        }

        var appointments = await query
            .OrderByDescending(x => x.AppointmentDate)
            .ThenByDescending(x => x.CreatedAtUtc)
            .ToListAsync();

        return Ok(appointments.Select(MapAppointment).ToList());
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AppointmentDto>> GetAppointment(Guid id)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var appointment = await LoadTrackedAppointmentAsync(id, userId.Value);
        if (appointment is null)
        {
            return NotFound(ApiResponse<object>.Failure("Appointment was not found."));
        }

        return Ok(MapAppointment(appointment));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AppointmentDto>> UpdateAppointment(Guid id, [FromBody] CreateAppointmentRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (!TryParseRequest(request, out var customerId, out var serviceIds, out var appointmentDate))
        {
            return BadRequest(ApiResponse<object>.Failure("Invalid appointment payload."));
        }

        var appointment = await LoadTrackedAppointmentAsync(id, userId.Value);
        if (appointment is null)
        {
            return NotFound(ApiResponse<object>.Failure("Appointment was not found."));
        }

        var customer = await _dbContext.Customers
            .Include(x => x.Salon)
            .FirstOrDefaultAsync(x => x.Id == customerId && x.UserId == userId.Value);

        if (customer is null)
        {
            return BadRequest(ApiResponse<object>.Failure("Customer was not found."));
        }

        var services = await _dbContext.Services
            .Where(x => x.UserId == userId.Value && serviceIds.Contains(x.Id))
            .OrderBy(x => x.Name)
            .ToListAsync();

        if (services.Count != serviceIds.Count)
        {
            return BadRequest(ApiResponse<object>.Failure("One or more services were not found."));
        }

        var triggerService = PickTriggerService(services);
        var scheduledForDate = appointmentDate.AddDays(triggerService.SuggestedReturnDays);
        var messageText = BuildFollowUpMessageText(customer.Name, triggerService.Name, triggerService.SuggestedReturnDays);

        appointment.CustomerId = customer.Id;
        appointment.Customer = customer;
        appointment.SalonId = customer.SalonId;
        appointment.Salon = customer.Salon;
        appointment.ServiceId = triggerService.Id;
        appointment.Service = triggerService;
        appointment.AppointmentDate = appointmentDate;
        appointment.Notes = NormalizeOptionalText(request.Notes);

        _dbContext.AppointmentServices.RemoveRange(appointment.AppointmentServices);
        appointment.AppointmentServices.Clear();

        foreach (var service in services.Select((item, index) => new { item, index }))
        {
            appointment.AppointmentServices.Add(new Domain.Entities.AppointmentService
            {
                UserId = userId.Value,
                AppointmentId = appointment.Id,
                CustomerId = customer.Id,
                ServiceId = service.item.Id,
                SalonId = customer.SalonId,
                AppointmentDate = appointmentDate,
                SuggestedReturnDays = service.item.SuggestedReturnDays,
                SortOrder = service.index,
                Service = service.item
            });
        }

        if (appointment.ScheduledMessage is null)
        {
            appointment.ScheduledMessage = new ScheduledMessage
            {
                UserId = userId.Value,
                AppointmentId = appointment.Id,
                CustomerId = customer.Id,
                ServiceId = triggerService.Id,
                SalonId = customer.SalonId,
                Status = MessageStatus.Pending
            };
            _dbContext.ScheduledMessages.Add(appointment.ScheduledMessage);
        }

        appointment.ScheduledMessage.UserId = userId.Value;
        appointment.ScheduledMessage.CustomerId = customer.Id;
        appointment.ScheduledMessage.ServiceId = triggerService.Id;
        appointment.ScheduledMessage.SalonId = customer.SalonId;
        appointment.ScheduledMessage.ScheduledForDate = scheduledForDate;
        appointment.ScheduledMessage.MessageText = messageText;
        appointment.ScheduledMessage.UpdatedAtUtc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        var updatedAppointment = await LoadAppointmentAsync(id, userId.Value);
        return Ok(MapAppointment(updatedAppointment!));
    }

    private Guid? GetUserId() => _currentUserService.UserId;

    private static bool TryParseRequest(
        CreateAppointmentRequest request,
        out Guid customerId,
        out List<Guid> serviceIds,
        out DateOnly appointmentDate)
    {
        appointmentDate = default;
        serviceIds = request.ServiceIds
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => Guid.TryParse(x, out var parsedId) ? parsedId : Guid.Empty)
            .Where(x => x != Guid.Empty)
            .Distinct()
            .ToList();

        return Guid.TryParse(request.CustomerId, out customerId) &&
               serviceIds.Count > 0 &&
               DateOnly.TryParse(request.AppointmentDate, out appointmentDate);
    }

    private async Task<Appointment?> LoadAppointmentAsync(Guid appointmentId, Guid userId)
    {
        return await _dbContext.Appointments
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Salon)
            .Include(x => x.Service)
            .Include(x => x.AppointmentServices)
                .ThenInclude(x => x.Service)
            .Include(x => x.ScheduledMessage)
            .FirstOrDefaultAsync(x => x.Id == appointmentId && x.UserId == userId);
    }

    private async Task<Appointment?> LoadTrackedAppointmentAsync(Guid appointmentId, Guid userId)
    {
        return await _dbContext.Appointments
            .Include(x => x.Customer)
                .ThenInclude(x => x.Salon)
            .Include(x => x.Salon)
            .Include(x => x.Service)
            .Include(x => x.AppointmentServices)
            .Include(x => x.ScheduledMessage)
            .FirstOrDefaultAsync(x => x.Id == appointmentId && x.UserId == userId);
    }

    private static AppointmentDto MapAppointment(Appointment appointment)
    {
        var orderedServices = appointment.AppointmentServices
            .OrderBy(x => x.SortOrder)
            .Select(x => x.Service)
            .ToList();
        var primaryService = orderedServices.FirstOrDefault() ?? appointment.Service;
        var serviceIds = orderedServices.Count > 0
            ? orderedServices.Select(x => x.Id.ToString()).ToArray()
            : new[] { primaryService.Id.ToString() };
        var serviceNames = orderedServices.Count > 0
            ? orderedServices.Select(x => x.Name).ToArray()
            : new[] { primaryService.Name };

        return new AppointmentDto
        {
            Id = appointment.Id.ToString(),
            CustomerId = appointment.CustomerId.ToString(),
            CustomerName = appointment.Customer.Name,
            CustomerInitials = BuildInitials(appointment.Customer.Name),
            CustomerPhotoUrl = appointment.Customer.PhotoUrl,
            ServiceId = primaryService.Id.ToString(),
            ServiceName = primaryService.Name,
            ServiceIds = serviceIds,
            ServiceNames = serviceNames,
            ContextSalonId = appointment.SalonId?.ToString(),
            ContextLabel = appointment.Salon?.Name ?? "Conta profissional",
            AppointmentDate = appointment.AppointmentDate.ToString("yyyy-MM-dd"),
            Notes = appointment.Notes,
            ScheduledMessageId = appointment.ScheduledMessage?.Id.ToString() ?? string.Empty,
            ScheduledForDate = appointment.ScheduledMessage?.ScheduledForDate.ToString("yyyy-MM-dd") ?? string.Empty,
            MessageStatus = CustomersController.MapMessageStatusLabel(appointment.ScheduledMessage?.Status),
            MessageText = appointment.ScheduledMessage?.MessageText ?? string.Empty
        };
    }

    private static string BuildInitials(string name)
    {
        var parts = name
            .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Take(2)
            .Select(part => char.ToUpperInvariant(part[0]));

        return string.Concat(parts);
    }

    private static Service PickTriggerService(IReadOnlyList<Service> services)
    {
        return services
            .OrderByDescending(x => x.SuggestedReturnDays)
            .ThenBy(x => x.Name)
            .First();
    }

    private static string BuildFollowUpMessageText(string customerName, string serviceName, int suggestedReturnDays)
    {
        return $"Oi, {customerName}! Tudo bem? Ja faz {suggestedReturnDays} dias desde {serviceName.ToLowerInvariant()}. Que tal agendar um retorno?";
    }

    private static string? NormalizeOptionalText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
