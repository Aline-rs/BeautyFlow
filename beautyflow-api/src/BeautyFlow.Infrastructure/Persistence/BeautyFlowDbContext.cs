using BeautyFlow.Domain.Entities;
using BeautyFlow.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Infrastructure.Persistence;

public sealed class BeautyFlowDbContext : DbContext
{
    public BeautyFlowDbContext(DbContextOptions<BeautyFlowDbContext> options)
        : base(options)
    {
    }

    public DbSet<Salon> Salons => Set<Salon>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<AppointmentService> AppointmentServices => Set<AppointmentService>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<MessageTemplate> MessageTemplates => Set<MessageTemplate>();
    public DbSet<NotificationSettings> NotificationSettings => Set<NotificationSettings>();
    public DbSet<ScheduledMessage> ScheduledMessages => Set<ScheduledMessage>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserSalon> UserSalons => Set<UserSalon>();

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
            entity.Property(x => x.ProfilePhotoUrl).HasMaxLength(512);
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<UserSalon>(entity =>
        {
            entity.ToTable("user_salons");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.UserId).IsRequired();
            entity.Property(x => x.SalonId).IsRequired();
            entity.Property(x => x.Role).HasMaxLength(64).IsRequired();
            entity.Property(x => x.IsPrimary).IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.UpdatedAtUtc);
            entity.HasIndex(x => new { x.UserId, x.SalonId }).IsUnique();
            entity.HasIndex(x => new { x.UserId, x.IsPrimary });

            entity
                .HasOne(x => x.User)
                .WithMany(x => x.UserSalons)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity
                .HasOne(x => x.Salon)
                .WithMany(x => x.UserSalons)
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
            entity.Property(x => x.UserId).IsRequired();
            entity.HasIndex(x => new { x.UserId, x.Name });
            entity.HasIndex(x => new { x.SalonId, x.Name });

            entity
                .HasOne(x => x.User)
                .WithMany(x => x.Customers)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity
                .HasOne(x => x.Salon)
                .WithMany(x => x.Customers)
                .HasForeignKey(x => x.SalonId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.ToTable("services");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.UserId).IsRequired();
            entity.Property(x => x.Name).HasMaxLength(160).IsRequired();
            entity.Property(x => x.SuggestedReturnDays).IsRequired();
            entity.Property(x => x.IsActive).IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.UpdatedAtUtc);
            entity.HasIndex(x => new { x.UserId, x.Name });

            entity
                .HasOne(x => x.User)
                .WithMany(x => x.Services)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.ToTable("appointments");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.AppointmentDate).IsRequired();
            entity.Property(x => x.Notes).HasMaxLength(2000);
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.UserId).IsRequired();
            entity.Property(x => x.CustomerId).IsRequired();
            entity.Property(x => x.ServiceId).IsRequired();
            entity.HasIndex(x => new { x.UserId, x.AppointmentDate });
            entity.HasIndex(x => new { x.SalonId, x.AppointmentDate });

            entity
                .HasOne(x => x.User)
                .WithMany(x => x.Appointments)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity
                .HasOne(x => x.Salon)
                .WithMany(x => x.Appointments)
                .HasForeignKey(x => x.SalonId)
                .OnDelete(DeleteBehavior.SetNull);

            entity
                .HasOne(x => x.Customer)
                .WithMany(x => x.Appointments)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasOne(x => x.Service)
                .WithMany(x => x.Appointments)
                .HasForeignKey(x => x.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasMany(x => x.AppointmentServices)
                .WithOne(x => x.Appointment)
                .HasForeignKey(x => x.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity
                .HasOne(x => x.ScheduledMessage)
                .WithOne(x => x.Appointment)
                .HasForeignKey<ScheduledMessage>(x => x.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AppointmentService>(entity =>
        {
            entity.ToTable("appointment_services");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.UserId).IsRequired();
            entity.Property(x => x.AppointmentId).IsRequired();
            entity.Property(x => x.CustomerId).IsRequired();
            entity.Property(x => x.ServiceId).IsRequired();
            entity.Property(x => x.AppointmentDate).IsRequired();
            entity.Property(x => x.SuggestedReturnDays).IsRequired();
            entity.Property(x => x.SortOrder).IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.HasIndex(x => new { x.AppointmentId, x.SortOrder });
            entity.HasIndex(x => new { x.UserId, x.AppointmentDate });

            entity
                .HasOne(x => x.User)
                .WithMany(x => x.AppointmentServices)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity
                .HasOne(x => x.Customer)
                .WithMany(x => x.AppointmentServices)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasOne(x => x.Service)
                .WithMany(x => x.AppointmentServices)
                .HasForeignKey(x => x.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasOne(x => x.Salon)
                .WithMany()
                .HasForeignKey(x => x.SalonId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ScheduledMessage>(entity =>
        {
            entity.ToTable("scheduled_messages");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.ScheduledForDate).IsRequired();
            entity.Property(x => x.MessageText).HasMaxLength(4000).IsRequired();
            entity.Property(x => x.Status)
                .HasConversion<string>()
                .HasMaxLength(24)
                .IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.UpdatedAtUtc);
            entity.Property(x => x.SentAtUtc);
            entity.Property(x => x.CanceledAtUtc);
            entity.Property(x => x.ErrorMessage).HasMaxLength(500);
            entity.Property(x => x.UserId).IsRequired();
            entity.Property(x => x.CustomerId).IsRequired();
            entity.Property(x => x.ServiceId).IsRequired();
            entity.Property(x => x.AppointmentId).IsRequired();
            entity.HasIndex(x => new { x.UserId, x.ScheduledForDate, x.Status });
            entity.HasIndex(x => new { x.SalonId, x.ScheduledForDate, x.Status });

            entity
                .HasOne(x => x.User)
                .WithMany(x => x.ScheduledMessages)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity
                .HasOne(x => x.Salon)
                .WithMany(x => x.ScheduledMessages)
                .HasForeignKey(x => x.SalonId)
                .OnDelete(DeleteBehavior.SetNull);

            entity
                .HasOne(x => x.Customer)
                .WithMany(x => x.ScheduledMessages)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasOne(x => x.Service)
                .WithMany(x => x.ScheduledMessages)
                .HasForeignKey(x => x.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<MessageTemplate>(entity =>
        {
            entity.ToTable("message_templates");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.UserId).IsRequired();
            entity.Property(x => x.TemplateText).HasMaxLength(4000).IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.UpdatedAtUtc);
            entity.HasIndex(x => x.UserId).IsUnique();

            entity
                .HasOne(x => x.User)
                .WithOne(x => x.MessageTemplate)
                .HasForeignKey<MessageTemplate>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<NotificationSettings>(entity =>
        {
            entity.ToTable("notification_settings");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.UserId).IsRequired();
            entity.Property(x => x.IsEnabled).IsRequired();
            entity.Property(x => x.PreferredTime).IsRequired();
            entity.Property(x => x.ReminderMode).HasMaxLength(40).IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.UpdatedAtUtc);
            entity.HasIndex(x => x.UserId).IsUnique();

            entity
                .HasOne(x => x.User)
                .WithOne(x => x.NotificationSettings)
                .HasForeignKey<NotificationSettings>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
