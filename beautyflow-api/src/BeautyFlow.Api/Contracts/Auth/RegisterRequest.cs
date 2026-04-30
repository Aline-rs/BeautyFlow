namespace BeautyFlow.Api.Contracts.Auth;

public sealed class RegisterRequest
{
    public string OwnerName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
