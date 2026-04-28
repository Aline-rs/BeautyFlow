using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class User : SalonOwnedEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public Salon Salon { get; set; } = null!;
}
