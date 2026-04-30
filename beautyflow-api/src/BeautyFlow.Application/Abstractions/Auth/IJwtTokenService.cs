using BeautyFlow.Application.Models.Auth;
using BeautyFlow.Domain.Entities;

namespace BeautyFlow.Application.Abstractions.Auth;

public interface IJwtTokenService
{
    AuthResponse CreateToken(User user, IReadOnlyCollection<UserSalon> userSalons, Guid? selectedSalonId);
}
