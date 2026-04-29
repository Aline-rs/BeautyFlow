using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "salons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Phone = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    Email = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_salons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "customers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Whatsapp = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    BirthDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ContactPreference = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Notes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    PhotoUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SalonId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_customers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_customers_salons_SalonId",
                        column: x => x.SalonId,
                        principalTable: "salons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "message_templates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TemplateText = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SalonId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_message_templates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_message_templates_salons_SalonId",
                        column: x => x.SalonId,
                        principalTable: "salons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notification_settings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    PreferredTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    ReminderMode = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SalonId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification_settings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_notification_settings_salons_SalonId",
                        column: x => x.SalonId,
                        principalTable: "salons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "services",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    SuggestedReturnDays = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SalonId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_services", x => x.Id);
                    table.ForeignKey(
                        name: "FK_services_salons_SalonId",
                        column: x => x.SalonId,
                        principalTable: "salons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Email = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SalonId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_users_salons_SalonId",
                        column: x => x.SalonId,
                        principalTable: "salons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "appointments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    AppointmentDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Notes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SalonId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_appointments_customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_appointments_salons_SalonId",
                        column: x => x.SalonId,
                        principalTable: "salons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_appointments_services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "scheduled_messages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AppointmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    ScheduledForDate = table.Column<DateOnly>(type: "date", nullable: false),
                    MessageText = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Status = table.Column<string>(type: "character varying(24)", maxLength: 24, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SentAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CanceledAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ErrorMessage = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    SalonId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_scheduled_messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_scheduled_messages_appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_scheduled_messages_customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_scheduled_messages_salons_SalonId",
                        column: x => x.SalonId,
                        principalTable: "salons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_scheduled_messages_services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointments_CustomerId",
                table: "appointments",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_SalonId_AppointmentDate",
                table: "appointments",
                columns: new[] { "SalonId", "AppointmentDate" });

            migrationBuilder.CreateIndex(
                name: "IX_appointments_ServiceId",
                table: "appointments",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_customers_SalonId_Name",
                table: "customers",
                columns: new[] { "SalonId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_message_templates_SalonId",
                table: "message_templates",
                column: "SalonId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_notification_settings_SalonId",
                table: "notification_settings",
                column: "SalonId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_salons_Email",
                table: "salons",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_scheduled_messages_AppointmentId",
                table: "scheduled_messages",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_scheduled_messages_CustomerId",
                table: "scheduled_messages",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_scheduled_messages_SalonId_ScheduledForDate_Status",
                table: "scheduled_messages",
                columns: new[] { "SalonId", "ScheduledForDate", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_scheduled_messages_ServiceId",
                table: "scheduled_messages",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_services_SalonId_Name",
                table: "services",
                columns: new[] { "SalonId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_SalonId",
                table: "users",
                column: "SalonId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "message_templates");

            migrationBuilder.DropTable(
                name: "notification_settings");

            migrationBuilder.DropTable(
                name: "scheduled_messages");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "appointments");

            migrationBuilder.DropTable(
                name: "customers");

            migrationBuilder.DropTable(
                name: "services");

            migrationBuilder.DropTable(
                name: "salons");
        }
    }
}
