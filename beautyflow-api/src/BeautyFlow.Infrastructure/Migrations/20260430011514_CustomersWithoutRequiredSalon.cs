using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CustomersWithoutRequiredSalon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "SalonId",
                table: "customers",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_customers_salons_SalonId",
                table: "customers",
                column: "SalonId",
                principalTable: "salons",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_customers_salons_SalonId",
                table: "customers");

            migrationBuilder.AlterColumn<Guid>(
                name: "SalonId",
                table: "customers",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);
        }
    }
}
