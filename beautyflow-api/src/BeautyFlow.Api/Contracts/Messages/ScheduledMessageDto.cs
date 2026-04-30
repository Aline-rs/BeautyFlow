namespace BeautyFlow.Api.Contracts.Messages;

public sealed class ScheduledMessageDto
{
    public string Id { get; init; } = string.Empty;
    public string AppointmentId { get; init; } = string.Empty;
    public string CustomerId { get; init; } = string.Empty;
    public string CustomerName { get; init; } = string.Empty;
    public string CustomerWhatsapp { get; init; } = string.Empty;
    public string ServiceId { get; init; } = string.Empty;
    public string ServiceName { get; init; } = string.Empty;
    public string ContextLabel { get; init; } = string.Empty;
    public string ScheduledForDate { get; init; } = string.Empty;
    public string MessageText { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string? SentAtUtc { get; init; }
    public string? ErrorMessage { get; init; }
}
