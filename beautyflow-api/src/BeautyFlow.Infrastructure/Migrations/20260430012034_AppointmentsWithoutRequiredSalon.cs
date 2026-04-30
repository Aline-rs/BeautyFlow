using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AppointmentsWithoutRequiredSalon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_salons_SalonId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_scheduled_messages_salons_SalonId",
                table: "scheduled_messages");

            migrationBuilder.AlterColumn<Guid>(
                name: "SalonId",
                table: "scheduled_messages",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "SalonId",
                table: "appointments",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_salons_SalonId",
                table: "appointments",
                column: "SalonId",
                principalTable: "salons",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_scheduled_messages_salons_SalonId",
                table: "scheduled_messages",
                column: "SalonId",
                principalTable: "salons",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_salons_SalonId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_scheduled_messages_salons_SalonId",
                table: "scheduled_messages");

            migrationBuilder.AlterColumn<Guid>(
                name: "SalonId",
                table: "scheduled_messages",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "SalonId",
                table: "appointments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_salons_SalonId",
                table: "appointments",
                column: "SalonId",
                principalTable: "salons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_scheduled_messages_salons_SalonId",
                table: "scheduled_messages",
                column: "SalonId",
                principalTable: "salons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
