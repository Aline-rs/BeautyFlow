namespace BeautyFlow.Application.Models.Appointments;

public sealed class AppointmentRegistrationResult
{
    public Guid AppointmentId { get; init; }
    public Guid ScheduledMessageId { get; init; }
    public DateOnly ScheduledForDate { get; init; }
    public string MessageText { get; init; } = string.Empty;
}
