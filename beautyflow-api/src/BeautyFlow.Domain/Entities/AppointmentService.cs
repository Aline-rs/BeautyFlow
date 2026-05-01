using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class AppointmentService : Entity
{
    public Guid UserId { get; set; }
    public Guid AppointmentId { get; set; }
    public Guid CustomerId { get; set; }
    public Guid ServiceId { get; set; }
    public Guid? SalonId { get; set; }
    public DateOnly AppointmentDate { get; set; }
    public int SuggestedReturnDays { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Appointment Appointment { get; set; } = null!;
    public Customer Customer { get; set; } = null!;
    public Service Service { get; set; } = null!;
    public Salon? Salon { get; set; }
}
