using BeautyFlow.Domain.Common;
using BeautyFlow.Domain.Enums;

namespace BeautyFlow.Domain.Entities;

public sealed class ScheduledMessage : SalonOwnedEntity
{
    public Guid UserId { get; set; }
    public Guid AppointmentId { get; set; }
    public Guid CustomerId { get; set; }
    public Guid ServiceId { get; set; }
    public DateOnly ScheduledForDate { get; set; }
    public string MessageText { get; set; } = string.Empty;
    public MessageStatus Status { get; set; } = MessageStatus.Pending;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
    public DateTime? SentAtUtc { get; set; }
    public DateTime? CanceledAtUtc { get; set; }
    public string? ErrorMessage { get; set; }

    public User User { get; set; } = null!;
    public Salon Salon { get; set; } = null!;
    public Appointment Appointment { get; set; } = null!;
    public Customer Customer { get; set; } = null!;
    public Service Service { get; set; } = null!;
}
