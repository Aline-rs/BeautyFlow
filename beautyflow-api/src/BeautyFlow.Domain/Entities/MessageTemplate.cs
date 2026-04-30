using BeautyFlow.Domain.Common;

namespace BeautyFlow.Domain.Entities;

public sealed class MessageTemplate : Entity
{
    public Guid UserId { get; set; }
    public string TemplateText { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public User User { get; set; } = null!;
}
