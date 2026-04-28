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
            string.IsNullOrWhiteSpace(request.SalonName) ||
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

        var salon = new Salon
        {
            Name = request.SalonName.Trim(),
            Phone = request.SalonPhone?.Trim(),
            Email = normalizedEmail
        };

        var user = new User
        {
            Name = request.OwnerName.Trim(),
            Email = normalizedEmail,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Salon = salon
        };

        _dbContext.Salons.Add(salon);
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        var response = _jwtTokenService.CreateToken(user, salon);
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
            .Include(x => x.Salon)
            .FirstOrDefaultAsync(x => x.Email == normalizedEmail);

        if (user is null || !_passwordHasher.VerifyPassword(user.PasswordHash, request.Password))
        {
            return Unauthorized(ApiResponse<object>.Failure("Invalid credentials."));
        }

        var response = _jwtTokenService.CreateToken(user, user.Salon);
        return Ok(ApiResponse<AuthResponse>.Success(response));
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public ActionResult<ApiResponse<object>> Me()
    {
        return Ok(ApiResponse<object>.Success(new
        {
            userId = _currentUserService.UserId,
            salonId = _currentUserService.SalonId,
            isAuthenticated = _currentUserService.IsAuthenticated
        }));
    }
}
