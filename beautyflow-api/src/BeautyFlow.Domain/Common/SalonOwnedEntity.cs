namespace BeautyFlow.Domain.Common;

public abstract class SalonOwnedEntity : Entity
{
    public Guid SalonId { get; set; }
}
