using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class UserSalon : Entity
{
    public Guid UserId { get; set; }
    public Guid SalonId { get; set; }
    public string Role { get; set; } = "Owner";
    public bool IsPrimary { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public User User { get; set; } = null!;
    public Salon Salon { get; set; } = null!;
}
