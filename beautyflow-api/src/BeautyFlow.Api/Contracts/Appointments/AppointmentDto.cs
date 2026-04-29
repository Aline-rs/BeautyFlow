namespace BeautyFlow.Api.Contracts.Appointments;

public sealed class AppointmentDto
{
    public string Id { get; init; } = string.Empty;
    public string CustomerId { get; init; } = string.Empty;
    public string CustomerName { get; init; } = string.Empty;
    public string ServiceId { get; init; } = string.Empty;
    public string ServiceName { get; init; } = string.Empty;
    public string AppointmentDate { get; init; } = string.Empty;
    public string? Notes { get; init; }
    public string ScheduledMessageId { get; init; } = string.Empty;
    public string ScheduledForDate { get; init; } = string.Empty;
    public string MessageStatus { get; init; } = string.Empty;
    public string MessageText { get; init; } = string.Empty;
}
