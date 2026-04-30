using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class Customer : SalonOwnedEntity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Whatsapp { get; set; } = string.Empty;
    public DateOnly? BirthDate { get; set; }
    public string ContactPreference { get; set; } = "WhatsApp";
    public string? Notes { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<ScheduledMessage> ScheduledMessages { get; set; } = new List<ScheduledMessage>();
    public User User { get; set; } = null!;
}
