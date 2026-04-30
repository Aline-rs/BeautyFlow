using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class Appointment : Entity
{
    public Guid UserId { get; set; }
    public Guid? SalonId { get; set; }
    public Guid CustomerId { get; set; }
    public Guid ServiceId { get; set; }
    public DateOnly AppointmentDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Salon? Salon { get; set; }
    public Customer Customer { get; set; } = null!;
    public Service Service { get; set; } = null!;
    public ScheduledMessage? ScheduledMessage { get; set; }
}
