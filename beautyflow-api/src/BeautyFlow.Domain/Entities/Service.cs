using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class Service : SalonOwnedEntity
{
    public string Name { get; set; } = string.Empty;
    public int SuggestedReturnDays { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public Salon Salon { get; set; } = null!;
}
