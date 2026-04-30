using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Application.Models.Auth;
using BeautyFlow.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BeautyFlow.Infrastructure.Auth;

public sealed class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public AuthResponse CreateToken(User user, IReadOnlyCollection<UserSalon> userSalons, Guid? selectedSalonId)
    {
        var jwtSection = _configuration.GetSection("Jwt");
        var issuer = jwtSection["Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is required.");
        var audience = jwtSection["Audience"] ?? throw new InvalidOperationException("Jwt:Audience is required.");
        var key = jwtSection["Key"] ?? throw new InvalidOperationException("Jwt:Key is required.");
        var expiresInMinutes = int.TryParse(jwtSection["ExpiresInMinutes"], out var parsedMinutes)
            ? parsedMinutes
            : 120;
        var effectiveSalonId = selectedSalonId
            ?? userSalons.FirstOrDefault(x => x.IsPrimary)?.SalonId
            ?? userSalons.FirstOrDefault()?.SalonId;

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(CustomClaimTypes.UserId, user.Id.ToString())
        };

        if (effectiveSalonId is not null)
        {
            claims.Add(new Claim(CustomClaimTypes.SelectedSalonId, effectiveSalonId.Value.ToString()));
        }

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: credentials);

        return new AuthResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            User = new AuthUserResponse
            {
                Id = user.Id.ToString(),
                Name = user.Name,
                Email = user.Email,
                ProfilePhotoUrl = user.ProfilePhotoUrl
            },
            Salons = userSalons
                .Select(link => new AuthSalonResponse
                {
                    Id = link.SalonId.ToString(),
                    Name = link.Salon.Name,
                    Phone = link.Salon.Phone,
                    Email = link.Salon.Email,
                    Role = link.Role,
                    IsPrimary = link.IsPrimary
                })
                .ToList(),
            SelectedSalonId = effectiveSalonId?.ToString()
        };
    }
}
