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
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Service> Services => Set<Service>();
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

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("customers");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Whatsapp).HasMaxLength(32).IsRequired();
            entity.Property(x => x.ContactPreference).HasMaxLength(32).IsRequired();
            entity.Property(x => x.Notes).HasMaxLength(2000);
            entity.Property(x => x.PhotoUrl).HasMaxLength(512);
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.UpdatedAtUtc);
            entity.Property(x => x.SalonId).IsRequired();
            entity.HasIndex(x => new { x.SalonId, x.Name });

            entity
                .HasOne(x => x.Salon)
                .WithMany(x => x.Customers)
                .HasForeignKey(x => x.SalonId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.ToTable("services");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasMaxLength(160).IsRequired();
            entity.Property(x => x.SuggestedReturnDays).IsRequired();
            entity.Property(x => x.IsActive).IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.UpdatedAtUtc);
            entity.Property(x => x.SalonId).IsRequired();
            entity.HasIndex(x => new { x.SalonId, x.Name });

            entity
                .HasOne(x => x.Salon)
                .WithMany(x => x.Services)
                .HasForeignKey(x => x.SalonId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
