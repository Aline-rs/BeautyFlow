using BeautyFlow.Api.Contracts;
using BeautyFlow.Api.Contracts.Salon;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Api.Controllers;

[ApiController]
[Authorize]
[Route("salon")]
public sealed class SalonController : ControllerBase
{
    private readonly BeautyFlowDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public SalonController(
        BeautyFlowDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    [HttpGet("profile")]
    [ProducesResponseType(typeof(SalonProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SalonProfileDto>> GetProfile()
    {
        var entities = await LoadProfileEntitiesAsync();
        if (entities is null)
        {
            return NotFound(ApiResponse<object>.Failure("Salon profile was not found."));
        }

        return Ok(MapProfile(entities.Value.salon, entities.Value.owner));
    }

    [HttpPut("profile")]
    [ProducesResponseType(typeof(SalonProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SalonProfileDto>> UpdateProfile([FromBody] UpdateSalonProfileRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.SalonName) ||
            string.IsNullOrWhiteSpace(request.OwnerName) ||
            string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(ApiResponse<object>.Failure("SalonName, OwnerName and Email are required."));
        }

        var entities = await LoadProfileEntitiesAsync(asNoTracking: false);
        if (entities is null)
        {
            return NotFound(ApiResponse<object>.Failure("Salon profile was not found."));
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailBelongsToAnotherUser = await _dbContext.Users.AnyAsync(x =>
            x.Email == normalizedEmail &&
            x.Id != entities.Value.owner.Id);

        if (emailBelongsToAnotherUser)
        {
            return BadRequest(ApiResponse<object>.Failure("A user with this email already exists."));
        }

        entities.Value.salon.Name = request.SalonName.Trim();
        entities.Value.salon.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        entities.Value.salon.Email = normalizedEmail;

        entities.Value.owner.Name = request.OwnerName.Trim();
        entities.Value.owner.Email = normalizedEmail;

        await _dbContext.SaveChangesAsync();

        return Ok(MapProfile(entities.Value.salon, entities.Value.owner));
    }

    private async Task<(Domain.Entities.Salon salon, Domain.Entities.User owner)?> LoadProfileEntitiesAsync(bool asNoTracking = true)
    {
        var salonId = _currentUserService.SalonId;
        var userId = _currentUserService.UserId;

        if (salonId is null || userId is null)
        {
            return null;
        }

        var salons = _dbContext.Salons.Where(x => x.Id == salonId.Value);
        var users = _dbContext.Users.Where(x => x.Id == userId.Value && x.SalonId == salonId.Value);

        if (asNoTracking)
        {
            salons = salons.AsNoTracking();
            users = users.AsNoTracking();
        }

        var salon = await salons.FirstOrDefaultAsync();
        var owner = await users.FirstOrDefaultAsync();

        return salon is null || owner is null ? null : (salon, owner);
    }

    private static SalonProfileDto MapProfile(Domain.Entities.Salon salon, Domain.Entities.User owner)
    {
        return new SalonProfileDto
        {
            SalonName = salon.Name,
            OwnerName = owner.Name,
            Email = owner.Email,
            Phone = salon.Phone
        };
    }
}
