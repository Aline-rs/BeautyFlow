namespace BeautyFlow.Api.Contracts.Appointments;

public sealed class CreateAppointmentRequest
{
    public string CustomerId { get; init; } = string.Empty;
    public string ServiceId { get; init; } = string.Empty;
    public string AppointmentDate { get; init; } = string.Empty;
    public string? Notes { get; init; }
}
