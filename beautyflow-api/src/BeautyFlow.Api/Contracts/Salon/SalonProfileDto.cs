namespace BeautyFlow.Api.Contracts.Salon;

public sealed class SalonProfileDto
{
    public string SalonName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Phone { get; init; }
}
