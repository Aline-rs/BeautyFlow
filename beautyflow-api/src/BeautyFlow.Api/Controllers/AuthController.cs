using BeautyFlow.Api.Contracts;
using BeautyFlow.Api.Contracts.Auth;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Application.Models.Auth;
using BeautyFlow.Domain.Entities;
using BeautyFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Api.Controllers;

[ApiController]
[Route("auth")]
public sealed class AuthController : ControllerBase
{
    private readonly BeautyFlowDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ICurrentUserService _currentUserService;

    public AuthController(
        BeautyFlowDbContext dbContext,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _currentUserService = currentUserService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(request.OwnerName) ||
            string.IsNullOrWhiteSpace(normalizedEmail) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(ApiResponse<object>.Failure("Invalid auth payload.", "Required fields were not provided."));
        }

        var emailAlreadyExists = await _dbContext.Users.AnyAsync(x => x.Email == normalizedEmail);
        if (emailAlreadyExists)
        {
            return BadRequest(ApiResponse<object>.Failure("A user with this email already exists."));
        }

        var user = new User
        {
            Name = request.OwnerName.Trim(),
            Email = normalizedEmail,
            PasswordHash = _passwordHasher.HashPassword(request.Password)
        };
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        var response = _jwtTokenService.CreateToken(user, [], null);
        return Ok(ApiResponse<AuthResponse>.Success(response));
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _dbContext.Users
            .Include(x => x.UserSalons)
            .ThenInclude(x => x.Salon)
            .FirstOrDefaultAsync(x => x.Email == normalizedEmail);

        if (user is null || !_passwordHasher.VerifyPassword(user.PasswordHash, request.Password))
        {
            return Unauthorized(ApiResponse<object>.Failure("Invalid credentials."));
        }

        var selectedSalonId = user.UserSalons.FirstOrDefault(x => x.IsPrimary)?.SalonId
            ?? user.UserSalons.FirstOrDefault()?.SalonId;
        var response = _jwtTokenService.CreateToken(user, user.UserSalons.ToList(), selectedSalonId);
        return Ok(ApiResponse<AuthResponse>.Success(response));
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<object>>> Me()
    {
        if (_currentUserService.UserId is null)
        {
            return Ok(ApiResponse<object>.Success(new
            {
                isAuthenticated = false
            }));
        }

        var user = await _dbContext.Users
            .AsNoTracking()
            .Include(x => x.UserSalons)
            .ThenInclude(x => x.Salon)
            .FirstOrDefaultAsync(x => x.Id == _currentUserService.UserId.Value);

        if (user is null)
        {
            return NotFound(ApiResponse<object>.Failure("User was not found."));
        }

        return Ok(ApiResponse<object>.Success(new
        {
            user = new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                profilePhotoUrl = user.ProfilePhotoUrl
            },
            userId = _currentUserService.UserId,
            selectedSalonId = _currentUserService.SelectedSalonId,
            salons = user.UserSalons
                .OrderByDescending(x => x.IsPrimary)
                .ThenBy(x => x.Salon.Name)
                .Select(x => new
                {
                    id = x.SalonId,
                    name = x.Salon.Name,
                    phone = x.Salon.Phone,
                    email = x.Salon.Email,
                    role = x.Role,
                    isPrimary = x.IsPrimary
                })
                .ToList(),
            isAuthenticated = _currentUserService.IsAuthenticated
        }));
    }
}
