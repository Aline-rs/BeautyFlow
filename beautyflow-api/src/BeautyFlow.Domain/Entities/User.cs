using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class User : Entity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? ProfilePhotoUrl { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    public MessageTemplate? MessageTemplate { get; set; }
    public NotificationSettings? NotificationSettings { get; set; }
    public ICollection<ScheduledMessage> ScheduledMessages { get; set; } = new List<ScheduledMessage>();
    public ICollection<Service> Services { get; set; } = new List<Service>();
    public ICollection<UserSalon> UserSalons { get; set; } = new List<UserSalon>();
}
