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
    private static readonly string[] AllowedPhotoExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    private readonly BeautyFlowDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly IWebHostEnvironment _environment;

    public SalonController(
        BeautyFlowDbContext dbContext,
        ICurrentUserService currentUserService,
        IWebHostEnvironment environment)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _environment = environment;
    }

    [HttpGet("profile")]
    [ProducesResponseType(typeof(SalonProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SalonProfileDto>> GetProfile()
    {
        var entities = await LoadProfileEntitiesAsync();
        if (entities is null)
        {
            return NotFound(ApiResponse<object>.Failure("Perfil do salão não foi encontrado."));
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
            return BadRequest(ApiResponse<object>.Failure("Nome do salão, nome da responsável e e-mail são obrigatórios."));
        }

        var entities = await LoadProfileEntitiesAsync(asNoTracking: false);
        if (entities is null)
        {
            return NotFound(ApiResponse<object>.Failure("Perfil do salão não foi encontrado."));
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailBelongsToAnotherUser = await _dbContext.Users.AnyAsync(x =>
            x.Email == normalizedEmail &&
            x.Id != entities.Value.owner.Id);

        if (emailBelongsToAnotherUser)
        {
            return BadRequest(ApiResponse<object>.Failure("Já existe uma conta cadastrada com este e-mail."));
        }

        entities.Value.salon.Name = request.SalonName.Trim();
        entities.Value.salon.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        entities.Value.salon.Email = normalizedEmail;

        entities.Value.owner.Name = request.OwnerName.Trim();
        entities.Value.owner.Email = normalizedEmail;

        await _dbContext.SaveChangesAsync();

        return Ok(MapProfile(entities.Value.salon, entities.Value.owner));
    }

    [HttpPost("profile-photo")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(SalonProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SalonProfileDto>> UploadProfilePhoto(IFormFile photo)
    {
        var entities = await LoadProfileEntitiesAsync(asNoTracking: false);
        if (entities is null)
        {
            return NotFound(ApiResponse<object>.Failure("Perfil do salão não foi encontrado."));
        }

        if (photo is null || photo.Length == 0)
        {
            return BadRequest(ApiResponse<object>.Failure("Envie uma foto para continuar."));
        }

        var extension = Path.GetExtension(photo.FileName).ToLowerInvariant();
        if (!AllowedPhotoExtensions.Contains(extension) ||
            !photo.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(ApiResponse<object>.Failure("Somente imagens JPG, PNG ou WEBP são permitidas."));
        }

        var uploadsRoot = Path.Combine(
            _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot"),
            "uploads",
            "profiles");

        Directory.CreateDirectory(uploadsRoot);

        var fileName = $"{entities.Value.owner.Id:N}-{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await photo.CopyToAsync(stream);
        }

        entities.Value.owner.ProfilePhotoUrl = $"/uploads/profiles/{fileName}";
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
            Phone = salon.Phone,
            ProfilePhotoUrl = owner.ProfilePhotoUrl
        };
    }
}
