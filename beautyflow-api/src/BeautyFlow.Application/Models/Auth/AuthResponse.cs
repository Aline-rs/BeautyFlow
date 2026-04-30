namespace BeautyFlow.Application.Models.Auth;

public sealed class AuthResponse
{
    public string Token { get; init; } = string.Empty;
    public AuthUserResponse User { get; init; } = new();
    public IReadOnlyList<AuthSalonResponse> Salons { get; init; } = [];
    public string? SelectedSalonId { get; init; }
}

public sealed class AuthUserResponse
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? ProfilePhotoUrl { get; init; }
}

public sealed class AuthSalonResponse
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public bool IsPrimary { get; init; }
}
