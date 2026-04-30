using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ProfessionalOwnedServicesAndSalonProfileContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_services_salons_SalonId",
                table: "services");

            migrationBuilder.DropIndex(
                name: "IX_services_SalonId_Name",
                table: "services");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "services",
                type: "uuid",
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE services AS s
                SET "UserId" = mapping."UserId"
                FROM (
                    SELECT DISTINCT ON (us."SalonId")
                        us."SalonId",
                        us."UserId"
                    FROM user_salons AS us
                    ORDER BY us."SalonId", us."IsPrimary" DESC, us."CreatedAtUtc", us."Id"
                ) AS mapping
                WHERE s."SalonId" = mapping."SalonId";
                """);

            migrationBuilder.Sql(
                """
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM services WHERE "UserId" IS NULL) THEN
                        RAISE EXCEPTION 'Nao foi possivel migrar todos os servicos para uma profissional.';
                    END IF;
                END $$;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "services",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "SalonId",
                table: "services");

            migrationBuilder.CreateIndex(
                name: "IX_services_UserId_Name",
                table: "services",
                columns: new[] { "UserId", "Name" });

            migrationBuilder.AddForeignKey(
                name: "FK_services_users_UserId",
                table: "services",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_services_users_UserId",
                table: "services");

            migrationBuilder.DropIndex(
                name: "IX_services_UserId_Name",
                table: "services");

            migrationBuilder.AddColumn<Guid>(
                name: "SalonId",
                table: "services",
                type: "uuid",
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE services AS s
                SET "SalonId" = mapping."SalonId"
                FROM (
                    SELECT DISTINCT ON (us."UserId")
                        us."UserId",
                        us."SalonId"
                    FROM user_salons AS us
                    ORDER BY us."UserId", us."IsPrimary" DESC, us."CreatedAtUtc", us."Id"
                ) AS mapping
                WHERE s."UserId" = mapping."UserId";
                """);

            migrationBuilder.Sql(
                """
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM services WHERE "SalonId" IS NULL) THEN
                        RAISE EXCEPTION 'Nao foi possivel restaurar todos os servicos para um salao.';
                    END IF;
                END $$;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "SalonId",
                table: "services",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "services");

            migrationBuilder.CreateIndex(
                name: "IX_services_SalonId_Name",
                table: "services",
                columns: new[] { "SalonId", "Name" });

            migrationBuilder.AddForeignKey(
                name: "FK_services_salons_SalonId",
                table: "services",
                column: "SalonId",
                principalTable: "salons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
