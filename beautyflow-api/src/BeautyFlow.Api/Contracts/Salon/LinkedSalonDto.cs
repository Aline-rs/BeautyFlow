namespace BeautyFlow.Api.Contracts.Salon;

public sealed class LinkedSalonDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public bool IsPrimary { get; init; }
}
