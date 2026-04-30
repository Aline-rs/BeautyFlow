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
        var salon = await LoadSalonAsync();
        if (salon is null)
        {
            return NotFound(ApiResponse<object>.Failure("Perfil do salao nao foi encontrado."));
        }

        return Ok(MapProfile(salon));
    }

    [HttpPut("profile")]
    [ProducesResponseType(typeof(SalonProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SalonProfileDto>> UpdateProfile([FromBody] UpdateSalonProfileRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.SalonName) || string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(ApiResponse<object>.Failure("Nome do salao e e-mail sao obrigatorios."));
        }

        var salon = await LoadSalonAsync(asNoTracking: false);
        if (salon is null)
        {
            return NotFound(ApiResponse<object>.Failure("Perfil do salao nao foi encontrado."));
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailBelongsToAnotherSalon = await _dbContext.Salons.AnyAsync(x =>
            x.Email == normalizedEmail &&
            x.Id != salon.Id);

        if (emailBelongsToAnotherSalon)
        {
            return BadRequest(ApiResponse<object>.Failure("Ja existe um salao cadastrado com este e-mail."));
        }

        salon.Name = request.SalonName.Trim();
        salon.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        salon.Email = normalizedEmail;

        await _dbContext.SaveChangesAsync();

        return Ok(MapProfile(salon));
    }

    private async Task<BeautyFlow.Domain.Entities.Salon?> LoadSalonAsync(bool asNoTracking = true)
    {
        var salonId = _currentUserService.SelectedSalonId;
        var userId = _currentUserService.UserId;

        if (salonId is null || userId is null)
        {
            return null;
        }

        var isLinked = await _dbContext.UserSalons
            .AsNoTracking()
            .AnyAsync(x => x.UserId == userId.Value && x.SalonId == salonId.Value);

        if (!isLinked)
        {
            return null;
        }

        var salons = _dbContext.Salons.Where(x => x.Id == salonId.Value);
        if (asNoTracking)
        {
            salons = salons.AsNoTracking();
        }

        return await salons.FirstOrDefaultAsync();
    }

    private static SalonProfileDto MapProfile(BeautyFlow.Domain.Entities.Salon salon)
    {
        return new SalonProfileDto
        {
            SalonName = salon.Name,
            Email = salon.Email,
            Phone = salon.Phone
        };
    }
}
