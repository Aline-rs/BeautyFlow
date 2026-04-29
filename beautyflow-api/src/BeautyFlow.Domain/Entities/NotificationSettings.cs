using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class NotificationSettings : SalonOwnedEntity
{
    public bool IsEnabled { get; set; } = true;
    public TimeOnly PreferredTime { get; set; } = new(9, 0);
    public string ReminderMode { get; set; } = "OnlyWhenDue";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public Salon Salon { get; set; } = null!;
}
