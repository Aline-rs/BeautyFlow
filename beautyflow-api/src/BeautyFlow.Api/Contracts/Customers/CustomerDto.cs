namespace BeautyFlow.Api.Contracts.Customers;

public sealed class CustomerDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Whatsapp { get; init; } = string.Empty;
    public string? ContextSalonId { get; init; }
    public string ContextLabel { get; init; } = string.Empty;
    public string? BirthDate { get; init; }
    public string ContactPreference { get; init; } = "WhatsApp";
    public string? Notes { get; init; }
    public string? PhotoUrl { get; init; }
    public string Initials { get; init; } = string.Empty;
    public string? NextServiceName { get; init; }
    public string? NextContactDate { get; init; }
    public string? LastAppointmentLabel { get; init; }
    public IReadOnlyList<CustomerHistoryItemDto> History { get; init; } = [];
}
