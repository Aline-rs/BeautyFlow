using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class Salon : Entity
{
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    public MessageTemplate? MessageTemplate { get; set; }
    public NotificationSettings? NotificationSettings { get; set; }
    public ICollection<ScheduledMessage> ScheduledMessages { get; set; } = new List<ScheduledMessage>();
    public ICollection<Service> Services { get; set; } = new List<Service>();
    public ICollection<User> Users { get; set; } = new List<User>();
}
