using BeautyFlow.Api.Contracts;
using BeautyFlow.Api.Contracts.Profile;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Api.Controllers;

[ApiController]
[Authorize]
[Route("profile")]
public sealed class ProfileController : ControllerBase
{
    private static readonly string[] AllowedPhotoExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    private readonly BeautyFlowDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly IWebHostEnvironment _environment;

    public ProfileController(
        BeautyFlowDbContext dbContext,
        ICurrentUserService currentUserService,
        IWebHostEnvironment environment)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _environment = environment;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ProfileDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ProfileDto>> GetProfile()
    {
        var user = await LoadUserAsync();
        if (user is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        return Ok(MapProfile(user));
    }

    [HttpPut]
    [ProducesResponseType(typeof(ProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProfileDto>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var user = await LoadUserAsync(asNoTracking: false);
        if (user is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(ApiResponse<object>.Failure("Name and email are required."));
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailBelongsToAnotherUser = await _dbContext.Users.AnyAsync(x =>
            x.Email == normalizedEmail &&
            x.Id != user.Id);

        if (emailBelongsToAnotherUser)
        {
            return BadRequest(ApiResponse<object>.Failure("A user with this email already exists."));
        }

        user.Name = request.Name.Trim();
        user.Email = normalizedEmail;
        await _dbContext.SaveChangesAsync();

        return Ok(MapProfile(user));
    }

    [HttpPost("photo")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProfileDto>> UploadProfilePhoto(IFormFile photo)
    {
        var user = await LoadUserAsync(asNoTracking: false);
        if (user is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (photo is null || photo.Length == 0)
        {
            return BadRequest(ApiResponse<object>.Failure("A photo file is required."));
        }

        var extension = Path.GetExtension(photo.FileName).ToLowerInvariant();
        if (!AllowedPhotoExtensions.Contains(extension) ||
            !photo.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(ApiResponse<object>.Failure("Only JPG, PNG or WEBP images are allowed."));
        }

        var uploadsRoot = Path.Combine(
            _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot"),
            "uploads",
            "profiles");

        Directory.CreateDirectory(uploadsRoot);

        var fileName = $"{user.Id:N}-{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await photo.CopyToAsync(stream);
        }

        user.ProfilePhotoUrl = $"/uploads/profiles/{fileName}";
        await _dbContext.SaveChangesAsync();

        return Ok(MapProfile(user));
    }

    private async Task<BeautyFlow.Domain.Entities.User?> LoadUserAsync(bool asNoTracking = true)
    {
        var userId = _currentUserService.UserId;
        if (userId is null)
        {
            return null;
        }

        var query = _dbContext.Users.Where(x => x.Id == userId.Value);
        if (asNoTracking)
        {
            query = query.AsNoTracking();
        }

        return await query.FirstOrDefaultAsync();
    }

    private static ProfileDto MapProfile(BeautyFlow.Domain.Entities.User user)
    {
        return new ProfileDto
        {
            Name = user.Name,
            Email = user.Email,
            ProfilePhotoUrl = user.ProfilePhotoUrl
        };
    }
}
