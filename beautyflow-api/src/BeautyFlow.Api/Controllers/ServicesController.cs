using BeautyFlow.Api.Contracts;
using BeautyFlow.Api.Contracts.Services;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Domain.Entities;
using BeautyFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Api.Controllers;

[ApiController]
[Authorize]
[Route("services")]
public sealed class ServicesController : ControllerBase
{
    private readonly BeautyFlowDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public ServicesController(
        BeautyFlowDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<ServiceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ServiceDto>>> GetServices()
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var services = await _dbContext.Services
            .AsNoTracking()
            .Where(x => x.SalonId == salonId.Value)
            .OrderByDescending(x => x.IsActive)
            .ThenBy(x => x.Name)
            .ToListAsync();

        return Ok(services.Select(MapService).ToList());
    }

    [HttpPost]
    [ProducesResponseType(typeof(ServiceDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ServiceDto>> CreateService([FromBody] ServiceUpsertRequest request)
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (!TryValidateRequest(request, out var normalizedName, out var errorResult))
        {
            return errorResult!;
        }

        var service = new Service
        {
            SalonId = salonId.Value,
            Name = normalizedName,
            SuggestedReturnDays = request.SuggestedReturnDays,
            IsActive = request.IsActive ?? true
        };

        _dbContext.Services.Add(service);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetServices), new { id = service.Id }, MapService(service));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ServiceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ServiceDto>> UpdateService(Guid id, [FromBody] ServiceUpsertRequest request)
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (!TryValidateRequest(request, out var normalizedName, out var errorResult))
        {
            return errorResult!;
        }

        var service = await _dbContext.Services
            .FirstOrDefaultAsync(x => x.Id == id && x.SalonId == salonId.Value);

        if (service is null)
        {
            return NotFound(ApiResponse<object>.Failure("Service was not found."));
        }

        service.Name = normalizedName;
        service.SuggestedReturnDays = request.SuggestedReturnDays;
        service.IsActive = request.IsActive ?? service.IsActive;
        service.UpdatedAtUtc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return Ok(MapService(service));
    }

    [HttpPatch("{id:guid}/status")]
    [ProducesResponseType(typeof(ServiceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ServiceDto>> UpdateStatus(Guid id, [FromBody] UpdateServiceStatusRequest request)
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var service = await _dbContext.Services
            .FirstOrDefaultAsync(x => x.Id == id && x.SalonId == salonId.Value);

        if (service is null)
        {
            return NotFound(ApiResponse<object>.Failure("Service was not found."));
        }

        service.IsActive = request.IsActive;
        service.UpdatedAtUtc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return Ok(MapService(service));
    }

    private Guid? GetSalonId()
    {
        return _currentUserService.SalonId;
    }

    private static bool TryValidateRequest(
        ServiceUpsertRequest request,
        out string normalizedName,
        out ActionResult<ServiceDto>? errorResult)
    {
        normalizedName = request.Name.Trim();
        errorResult = null;

        if (string.IsNullOrWhiteSpace(normalizedName))
        {
            errorResult = new BadRequestObjectResult(ApiResponse<object>.Failure("Service name is required."));
            return false;
        }

        if (request.SuggestedReturnDays <= 0)
        {
            errorResult = new BadRequestObjectResult(ApiResponse<object>.Failure("SuggestedReturnDays must be greater than zero."));
            return false;
        }

        return true;
    }

    private static ServiceDto MapService(Service service)
    {
        return new ServiceDto
        {
            Id = service.Id.ToString(),
            Name = service.Name,
            SuggestedReturnDays = service.SuggestedReturnDays,
            IsActive = service.IsActive
        };
    }
}
