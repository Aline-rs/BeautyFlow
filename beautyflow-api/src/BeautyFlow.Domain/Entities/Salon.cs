using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class Salon : Entity
{
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    public ICollection<User> Users { get; set; } = new List<User>();
}
