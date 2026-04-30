using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class Service : Entity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int SuggestedReturnDays { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<ScheduledMessage> ScheduledMessages { get; set; } = new List<ScheduledMessage>();
}
