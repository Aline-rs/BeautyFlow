using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class MessageTemplate : SalonOwnedEntity
{
    public string TemplateText { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public Salon Salon { get; set; } = null!;
}
