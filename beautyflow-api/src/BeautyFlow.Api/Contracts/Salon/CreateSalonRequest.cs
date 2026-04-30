namespace BeautyFlow.Api.Contracts.Salon;

public sealed class CreateSalonRequest
{
    public string Name { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public string Email { get; init; } = string.Empty;
    public bool MakePrimary { get; init; }
}
