using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MultiServiceAppointments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "appointment_services",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AppointmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    SalonId = table.Column<Guid>(type: "uuid", nullable: true),
                    AppointmentDate = table.Column<DateOnly>(type: "date", nullable: false),
                    SuggestedReturnDays = table.Column<int>(type: "integer", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointment_services", x => x.Id);
                    table.ForeignKey(
                        name: "FK_appointment_services_appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_appointment_services_customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_appointment_services_salons_SalonId",
                        column: x => x.SalonId,
                        principalTable: "salons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_appointment_services_services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_appointment_services_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointment_services_AppointmentId_SortOrder",
                table: "appointment_services",
                columns: new[] { "AppointmentId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_appointment_services_CustomerId",
                table: "appointment_services",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_appointment_services_SalonId",
                table: "appointment_services",
                column: "SalonId");

            migrationBuilder.CreateIndex(
                name: "IX_appointment_services_ServiceId",
                table: "appointment_services",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_appointment_services_UserId_AppointmentDate",
                table: "appointment_services",
                columns: new[] { "UserId", "AppointmentDate" });

            migrationBuilder.Sql(
                """
                INSERT INTO appointment_services (
                    "Id",
                    "UserId",
                    "AppointmentId",
                    "CustomerId",
                    "ServiceId",
                    "SalonId",
                    "AppointmentDate",
                    "SuggestedReturnDays",
                    "SortOrder",
                    "CreatedAtUtc"
                )
                SELECT
                    gen_random_uuid(),
                    a."UserId",
                    a."Id",
                    a."CustomerId",
                    a."ServiceId",
                    a."SalonId",
                    a."AppointmentDate",
                    s."SuggestedReturnDays",
                    0,
                    a."CreatedAtUtc"
                FROM appointments a
                INNER JOIN services s ON s."Id" = a."ServiceId"
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM appointment_services links
                    WHERE links."AppointmentId" = a."Id"
                );
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "appointment_services");
        }
    }
}
