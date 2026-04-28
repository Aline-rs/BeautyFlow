using BeautyFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Infrastructure.Persistence;

public sealed class BeautyFlowDbContext : DbContext
{
    public BeautyFlowDbContext(DbContextOptions<BeautyFlowDbContext> options)
        : base(options)
    {
    }

    public DbSet<Salon> Salons => Set<Salon>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Salon>(entity =>
        {
            entity.ToTable("salons");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Phone).HasMaxLength(40);
            entity.Property(x => x.Email).HasMaxLength(160).IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(160).IsRequired();
            entity.Property(x => x.PasswordHash).HasMaxLength(512).IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.SalonId).IsRequired();
            entity.HasIndex(x => x.Email).IsUnique();

            entity
                .HasOne(x => x.Salon)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.SalonId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
