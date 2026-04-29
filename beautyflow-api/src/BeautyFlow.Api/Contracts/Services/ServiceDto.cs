namespace BeautyFlow.Api.Contracts.Services;

public sealed class ServiceDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public int SuggestedReturnDays { get; init; }
    public bool IsActive { get; init; }
}
