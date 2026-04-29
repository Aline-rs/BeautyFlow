using BeautyFlow.Api.Contracts;
using BeautyFlow.Api.Contracts.Customers;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Domain.Entities;
using BeautyFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Api.Controllers;

[ApiController]
[Authorize]
[Route("customers")]
public sealed class CustomersController : ControllerBase
{
    private static readonly string[] AllowedPhotoExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    private readonly BeautyFlowDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly IWebHostEnvironment _environment;

    public CustomersController(
        BeautyFlowDbContext dbContext,
        ICurrentUserService currentUserService,
        IWebHostEnvironment environment)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _environment = environment;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<CustomerDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<CustomerDto>>> GetCustomers(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _dbContext.Customers
            .AsNoTracking()
            .Where(x => x.SalonId == salonId.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim().ToLowerInvariant();
            query = query.Where(x =>
                EF.Functions.ILike(x.Name, $"%{normalizedSearch}%") ||
                EF.Functions.ILike(x.Whatsapp, $"%{normalizedSearch}%"));
        }

        var customers = await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(customers.Select(MapCustomer).ToList());
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerDto>> GetCustomer(Guid id)
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var customer = await _dbContext.Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && x.SalonId == salonId.Value);

        if (customer is null)
        {
            return NotFound(ApiResponse<object>.Failure("Customer was not found."));
        }

        return Ok(MapCustomer(customer));
    }

    [HttpPost]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CustomerDto>> CreateCustomer([FromBody] CustomerUpsertRequest request)
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (!TryValidateRequest(request, out var normalizedName, out var normalizedWhatsapp, out var birthDate, out var errorResult))
        {
            return errorResult!;
        }

        var customer = new Customer
        {
            SalonId = salonId.Value,
            Name = normalizedName,
            Whatsapp = normalizedWhatsapp,
            BirthDate = birthDate,
            ContactPreference = NormalizeContactPreference(request.ContactPreference),
            Notes = NormalizeOptionalText(request.Notes),
            PhotoUrl = NormalizeOptionalText(request.PhotoUrl)
        };

        _dbContext.Customers.Add(customer);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, MapCustomer(customer));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerDto>> UpdateCustomer(Guid id, [FromBody] CustomerUpsertRequest request)
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (!TryValidateRequest(request, out var normalizedName, out var normalizedWhatsapp, out var birthDate, out var errorResult))
        {
            return errorResult!;
        }

        var customer = await _dbContext.Customers
            .FirstOrDefaultAsync(x => x.Id == id && x.SalonId == salonId.Value);

        if (customer is null)
        {
            return NotFound(ApiResponse<object>.Failure("Customer was not found."));
        }

        customer.Name = normalizedName;
        customer.Whatsapp = normalizedWhatsapp;
        customer.BirthDate = birthDate;
        customer.ContactPreference = NormalizeContactPreference(request.ContactPreference);
        customer.Notes = NormalizeOptionalText(request.Notes);
        customer.PhotoUrl = NormalizeOptionalText(request.PhotoUrl);
        customer.UpdatedAtUtc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return Ok(MapCustomer(customer));
    }

    [HttpPost("{id:guid}/photo")]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerDto>> UploadPhoto(Guid id, [FromForm] IFormFile photo)
    {
        var salonId = GetSalonId();
        if (salonId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var customer = await _dbContext.Customers
            .FirstOrDefaultAsync(x => x.Id == id && x.SalonId == salonId.Value);

        if (customer is null)
        {
            return NotFound(ApiResponse<object>.Failure("Customer was not found."));
        }

        if (photo is null || photo.Length == 0)
        {
            return BadRequest(ApiResponse<object>.Failure("A photo file is required."));
        }

        var extension = Path.GetExtension(photo.FileName).ToLowerInvariant();
        if (!AllowedPhotoExtensions.Contains(extension) || !photo.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(ApiResponse<object>.Failure("Only image uploads are allowed."));
        }

        var uploadsRoot = Path.Combine(_environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot"), "uploads", "customers");
        Directory.CreateDirectory(uploadsRoot);

        var fileName = $"{customer.Id:N}-{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await photo.CopyToAsync(stream);
        }

        customer.PhotoUrl = $"/uploads/customers/{fileName}";
        customer.UpdatedAtUtc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return Ok(MapCustomer(customer));
    }

    private ActionResult<CustomerDto>? BuildInvalidRequestResult(string message)
    {
        return BadRequest(ApiResponse<object>.Failure(message));
    }

    private bool TryValidateRequest(
        CustomerUpsertRequest request,
        out string normalizedName,
        out string normalizedWhatsapp,
        out DateOnly? birthDate,
        out ActionResult<CustomerDto>? errorResult)
    {
        normalizedName = request.Name.Trim();
        normalizedWhatsapp = request.Whatsapp.Trim();
        birthDate = null;
        errorResult = null;

        if (string.IsNullOrWhiteSpace(normalizedName) || string.IsNullOrWhiteSpace(normalizedWhatsapp))
        {
            errorResult = BuildInvalidRequestResult("Name and WhatsApp are required.");
            return false;
        }

        if (!string.IsNullOrWhiteSpace(request.BirthDate))
        {
            if (!DateOnly.TryParse(request.BirthDate, out var parsedBirthDate))
            {
                errorResult = BuildInvalidRequestResult("BirthDate must be a valid date in yyyy-MM-dd format.");
                return false;
            }

            birthDate = parsedBirthDate;
        }

        return true;
    }

    private CustomerDto MapCustomer(Customer customer)
    {
        return new CustomerDto
        {
            Id = customer.Id.ToString(),
            Name = customer.Name,
            Whatsapp = customer.Whatsapp,
            BirthDate = customer.BirthDate?.ToString("yyyy-MM-dd"),
            ContactPreference = customer.ContactPreference,
            Notes = customer.Notes,
            PhotoUrl = BuildAbsoluteUrl(customer.PhotoUrl),
            Initials = BuildInitials(customer.Name),
            NextServiceName = null,
            NextContactDate = null,
            LastAppointmentLabel = null,
            History = []
        };
    }

    private Guid? GetSalonId()
    {
        return _currentUserService.SalonId;
    }

    private string? BuildAbsoluteUrl(string? relativeUrl)
    {
        if (string.IsNullOrWhiteSpace(relativeUrl))
        {
            return null;
        }

        if (Uri.TryCreate(relativeUrl, UriKind.Absolute, out _))
        {
            return relativeUrl;
        }

        return $"{Request.Scheme}://{Request.Host}{relativeUrl}";
    }

    private static string BuildInitials(string name)
    {
        var parts = name
            .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Take(2)
            .Select(part => char.ToUpperInvariant(part[0]));

        return string.Concat(parts);
    }

    private static string NormalizeContactPreference(string? contactPreference)
    {
        if (string.IsNullOrWhiteSpace(contactPreference))
        {
            return "WhatsApp";
        }

        return contactPreference.Trim();
    }

    private static string? NormalizeOptionalText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
