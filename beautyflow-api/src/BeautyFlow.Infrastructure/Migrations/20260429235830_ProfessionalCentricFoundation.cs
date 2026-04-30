using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ProfessionalCentricFoundation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_customers_salons_SalonId",
                table: "customers");

            migrationBuilder.DropForeignKey(
                name: "FK_message_templates_salons_SalonId",
                table: "message_templates");

            migrationBuilder.DropForeignKey(
                name: "FK_notification_settings_salons_SalonId",
                table: "notification_settings");

            migrationBuilder.DropForeignKey(
                name: "FK_users_salons_SalonId",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_message_templates_SalonId",
                table: "message_templates");

            migrationBuilder.DropIndex(
                name: "IX_notification_settings_SalonId",
                table: "notification_settings");

            migrationBuilder.DropIndex(
                name: "IX_users_SalonId",
                table: "users");

            migrationBuilder.AddColumn<string>(
                name: "ProfilePhotoUrl",
                table: "users",
                type: "character varying(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "notification_settings",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "message_templates",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "scheduled_messages",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "customers",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "appointments",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "user_salons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SalonId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    IsPrimary = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_salons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_salons_salons_SalonId",
                        column: x => x.SalonId,
                        principalTable: "salons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_salons_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql(
                """
                INSERT INTO user_salons ("Id", "UserId", "SalonId", "Role", "IsPrimary", "CreatedAtUtc", "UpdatedAtUtc")
                SELECT "Id", "Id", "SalonId", 'Owner', TRUE, NOW(), NULL
                FROM users
                WHERE "SalonId" IS NOT NULL;
                """);

            migrationBuilder.Sql(
                """
                UPDATE customers AS c
                SET "UserId" = (
                    SELECT u."Id"
                    FROM users AS u
                    WHERE u."SalonId" = c."SalonId"
                    ORDER BY u."CreatedAtUtc"
                    LIMIT 1
                )
                WHERE c."UserId" IS NULL;
                """);

            migrationBuilder.Sql(
                """
                UPDATE appointments AS a
                SET "UserId" = (
                    SELECT c."UserId"
                    FROM customers AS c
                    WHERE c."Id" = a."CustomerId"
                    LIMIT 1
                )
                WHERE a."UserId" IS NULL;
                """);

            migrationBuilder.Sql(
                """
                UPDATE scheduled_messages AS sm
                SET "UserId" = (
                    SELECT a."UserId"
                    FROM appointments AS a
                    WHERE a."Id" = sm."AppointmentId"
                    LIMIT 1
                )
                WHERE sm."UserId" IS NULL;
                """);

            migrationBuilder.Sql(
                """
                UPDATE message_templates AS mt
                SET "UserId" = (
                    SELECT u."Id"
                    FROM users AS u
                    WHERE u."SalonId" = mt."SalonId"
                    ORDER BY u."CreatedAtUtc"
                    LIMIT 1
                )
                WHERE mt."UserId" IS NULL;
                """);

            migrationBuilder.Sql(
                """
                UPDATE notification_settings AS ns
                SET "UserId" = (
                    SELECT u."Id"
                    FROM users AS u
                    WHERE u."SalonId" = ns."SalonId"
                    ORDER BY u."CreatedAtUtc"
                    LIMIT 1
                )
                WHERE ns."UserId" IS NULL;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "scheduled_messages",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "customers",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "appointments",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "message_templates",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "notification_settings",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "SalonId",
                table: "users");

            migrationBuilder.DropColumn(
                name: "SalonId",
                table: "message_templates");

            migrationBuilder.DropColumn(
                name: "SalonId",
                table: "notification_settings");

            migrationBuilder.CreateIndex(
                name: "IX_scheduled_messages_UserId_ScheduledForDate_Status",
                table: "scheduled_messages",
                columns: new[] { "UserId", "ScheduledForDate", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_customers_UserId_Name",
                table: "customers",
                columns: new[] { "UserId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_appointments_UserId_AppointmentDate",
                table: "appointments",
                columns: new[] { "UserId", "AppointmentDate" });

            migrationBuilder.CreateIndex(
                name: "IX_message_templates_UserId",
                table: "message_templates",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_notification_settings_UserId",
                table: "notification_settings",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_salons_SalonId",
                table: "user_salons",
                column: "SalonId");

            migrationBuilder.CreateIndex(
                name: "IX_user_salons_UserId_IsPrimary",
                table: "user_salons",
                columns: new[] { "UserId", "IsPrimary" });

            migrationBuilder.CreateIndex(
                name: "IX_user_salons_UserId_SalonId",
                table: "user_salons",
                columns: new[] { "UserId", "SalonId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_users_UserId",
                table: "appointments",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_customers_users_UserId",
                table: "customers",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_message_templates_users_UserId",
                table: "message_templates",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_notification_settings_users_UserId",
                table: "notification_settings",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_scheduled_messages_users_UserId",
                table: "scheduled_messages",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_users_UserId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_customers_users_UserId",
                table: "customers");

            migrationBuilder.DropForeignKey(
                name: "FK_message_templates_users_UserId",
                table: "message_templates");

            migrationBuilder.DropForeignKey(
                name: "FK_notification_settings_users_UserId",
                table: "notification_settings");

            migrationBuilder.DropForeignKey(
                name: "FK_scheduled_messages_users_UserId",
                table: "scheduled_messages");

            migrationBuilder.DropTable(
                name: "user_salons");

            migrationBuilder.DropIndex(
                name: "IX_scheduled_messages_UserId_ScheduledForDate_Status",
                table: "scheduled_messages");

            migrationBuilder.DropIndex(
                name: "IX_customers_UserId_Name",
                table: "customers");

            migrationBuilder.DropIndex(
                name: "IX_appointments_UserId_AppointmentDate",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_message_templates_UserId",
                table: "message_templates");

            migrationBuilder.DropIndex(
                name: "IX_notification_settings_UserId",
                table: "notification_settings");

            migrationBuilder.DropColumn(
                name: "ProfilePhotoUrl",
                table: "users");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "scheduled_messages");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "customers");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "appointments");

            migrationBuilder.AddColumn<Guid>(
                name: "SalonId",
                table: "users",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "SalonId",
                table: "notification_settings",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "SalonId",
                table: "message_templates",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.Sql(
                """
                UPDATE users AS u
                SET "SalonId" = (
                    SELECT us."SalonId"
                    FROM user_salons AS us
                    WHERE us."UserId" = u."Id"
                    ORDER BY us."IsPrimary" DESC, us."CreatedAtUtc"
                    LIMIT 1
                );
                """);

            migrationBuilder.Sql(
                """
                UPDATE message_templates AS mt
                SET "SalonId" = (
                    SELECT us."SalonId"
                    FROM user_salons AS us
                    WHERE us."UserId" = mt."UserId"
                    ORDER BY us."IsPrimary" DESC, us."CreatedAtUtc"
                    LIMIT 1
                );
                """);

            migrationBuilder.Sql(
                """
                UPDATE notification_settings AS ns
                SET "SalonId" = (
                    SELECT us."SalonId"
                    FROM user_salons AS us
                    WHERE us."UserId" = ns."UserId"
                    ORDER BY us."IsPrimary" DESC, us."CreatedAtUtc"
                    LIMIT 1
                );
                """);

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "notification_settings");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "message_templates");

            migrationBuilder.CreateIndex(
                name: "IX_users_SalonId",
                table: "users",
                column: "SalonId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_customers_salons_SalonId",
                table: "customers",
                column: "SalonId",
                principalTable: "salons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_message_templates_salons_SalonId",
                table: "message_templates",
                column: "SalonId",
                principalTable: "salons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_notification_settings_salons_SalonId",
                table: "notification_settings",
                column: "SalonId",
                principalTable: "salons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_users_salons_SalonId",
                table: "users",
                column: "SalonId",
                principalTable: "salons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
