namespace BeautyFlow.Api.Contracts.Customers;

public sealed class CustomerHistoryItemDto
{
    public string Id { get; init; } = string.Empty;
    public string ServiceName { get; init; } = string.Empty;
    public string ContextLabel { get; init; } = string.Empty;
    public string AppointmentDate { get; init; } = string.Empty;
    public string MessageStatus { get; init; } = "Pendente";
    public string? NextContactDate { get; init; }
}
