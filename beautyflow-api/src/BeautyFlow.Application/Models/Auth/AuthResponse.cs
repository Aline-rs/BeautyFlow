namespace BeautyFlow.Application.Models.Auth;

public sealed class AuthResponse
{
    public string Token { get; init; } = string.Empty;
    public AuthUserResponse User { get; init; } = new();
}

public sealed class AuthUserResponse
{
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string SalonName { get; init; } = string.Empty;
}
