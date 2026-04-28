using System.Security.Claims;
using BeautyFlow.Application.Abstractions.Auth;

namespace BeautyFlow.Api.Auth;

public sealed class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? UserId => GetGuidClaim(CustomClaimTypes.UserId);

    public Guid? SalonId => GetGuidClaim(CustomClaimTypes.SalonId);

    public bool IsAuthenticated =>
        _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated == true;

    private Guid? GetGuidClaim(string claimType)
    {
        var rawValue = _httpContextAccessor.HttpContext?.User?.FindFirstValue(claimType);

        return Guid.TryParse(rawValue, out var value) ? value : null;
    }
}
