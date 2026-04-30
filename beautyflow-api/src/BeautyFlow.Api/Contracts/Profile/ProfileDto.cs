namespace BeautyFlow.Api.Contracts.Profile;

public sealed class ProfileDto
{
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? ProfilePhotoUrl { get; init; }
}
