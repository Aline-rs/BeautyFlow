using BeautyFlow.Api.Contracts;
using BeautyFlow.Api.Contracts.Salon;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Domain.Entities;
using BeautyFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Api.Controllers;

[ApiController]
[Authorize]
[Route("salons")]
public sealed class SalonsController : ControllerBase
{
    private readonly BeautyFlowDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public SalonsController(
        BeautyFlowDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<LinkedSalonDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<LinkedSalonDto>>> GetSalons()
    {
        var userId = _currentUserService.UserId;
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var linkedSalons = await _dbContext.UserSalons
            .AsNoTracking()
            .Include(x => x.Salon)
            .Where(x => x.UserId == userId.Value)
            .OrderByDescending(x => x.IsPrimary)
            .ThenBy(x => x.Salon.Name)
            .ToListAsync();

        return Ok(linkedSalons.Select(MapLinkedSalon).ToList());
    }

    [HttpPost]
    [ProducesResponseType(typeof(LinkedSalonDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LinkedSalonDto>> CreateSalon([FromBody] CreateSalonRequest request)
    {
        var userId = _currentUserService.UserId;
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(ApiResponse<object>.Failure("Salon name and email are required."));
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId.Value);
        if (user is null)
        {
            return NotFound(ApiResponse<object>.Failure("User was not found."));
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var salon = new Salon
        {
            Name = request.Name.Trim(),
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            Email = normalizedEmail
        };

        var shouldBePrimary = request.MakePrimary ||
            !await _dbContext.UserSalons.AnyAsync(x => x.UserId == userId.Value && x.IsPrimary);

        if (shouldBePrimary)
        {
            var currentPrimaryLinks = await _dbContext.UserSalons
                .Where(x => x.UserId == userId.Value && x.IsPrimary)
                .ToListAsync();

            foreach (var currentPrimaryLink in currentPrimaryLinks)
            {
                currentPrimaryLink.IsPrimary = false;
                currentPrimaryLink.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        var userSalon = new UserSalon
        {
            UserId = user.Id,
            Salon = salon,
            Role = "Owner",
            IsPrimary = shouldBePrimary
        };

        _dbContext.Salons.Add(salon);
        _dbContext.UserSalons.Add(userSalon);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSalons), new { id = salon.Id }, MapLinkedSalon(userSalon));
    }

    private static LinkedSalonDto MapLinkedSalon(UserSalon userSalon)
    {
        return new LinkedSalonDto
        {
            Id = userSalon.SalonId.ToString(),
            Name = userSalon.Salon.Name,
            Phone = userSalon.Salon.Phone,
            Email = userSalon.Salon.Email,
            Role = userSalon.Role,
            IsPrimary = userSalon.IsPrimary
        };
    }
}
