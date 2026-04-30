using System.Security.Claims;
using BeautyFlow.Application.Abstractions.Auth;

namespace BeautyFlow.Api.Auth;

public sealed class CurrentUserService : ICurrentUserService
{
    private const string SalonIdHeaderName = "X-Salon-Id";

    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? UserId => GetGuidClaim(CustomClaimTypes.UserId);

    public Guid? SelectedSalonId =>
        GetGuidHeader(SalonIdHeaderName) ??
        GetGuidClaim(CustomClaimTypes.SelectedSalonId) ??
        GetGuidClaim(CustomClaimTypes.LegacySalonId);

    public Guid? SalonId => SelectedSalonId;

    public bool IsAuthenticated =>
        _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated == true;

    private Guid? GetGuidClaim(string claimType)
    {
        var rawValue = _httpContextAccessor.HttpContext?.User?.FindFirstValue(claimType);

        return Guid.TryParse(rawValue, out var value) ? value : null;
    }

    private Guid? GetGuidHeader(string headerName)
    {
        var rawValue = _httpContextAccessor.HttpContext?.Request.Headers[headerName].FirstOrDefault();

        return Guid.TryParse(rawValue, out var value) ? value : null;
    }
}
