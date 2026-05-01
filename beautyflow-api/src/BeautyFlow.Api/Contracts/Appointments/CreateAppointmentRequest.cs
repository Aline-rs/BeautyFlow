namespace BeautyFlow.Api.Contracts.Appointments;

public sealed class CreateAppointmentRequest
{
    public string CustomerId { get; init; } = string.Empty;
    public string[] ServiceIds { get; init; } = [];
    public string AppointmentDate { get; init; } = string.Empty;
    public string? Notes { get; init; }
}
