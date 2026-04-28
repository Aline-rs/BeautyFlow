namespace BeautyFlow.Application.Abstractions.Auth;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    Guid? SalonId { get; }
    bool IsAuthenticated { get; }
}
