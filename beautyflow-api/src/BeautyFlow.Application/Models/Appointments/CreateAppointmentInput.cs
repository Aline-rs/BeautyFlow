namespace BeautyFlow.Application.Models.Appointments;

public sealed class CreateAppointmentInput
{
    public Guid CustomerId { get; init; }
    public IReadOnlyList<Guid> ServiceIds { get; init; } = [];
    public DateOnly AppointmentDate { get; init; }
    public string? Notes { get; init; }
}
