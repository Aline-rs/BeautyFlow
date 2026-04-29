namespace BeautyFlow.Api.Contracts.Customers;

public sealed class CustomerUpsertRequest
{
    public string Name { get; init; } = string.Empty;
    public string Whatsapp { get; init; } = string.Empty;
    public string? BirthDate { get; init; }
    public string ContactPreference { get; init; } = "WhatsApp";
    public string? Notes { get; init; }
    public string? PhotoUrl { get; init; }
}
