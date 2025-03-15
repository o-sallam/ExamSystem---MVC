using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlineExamSystem.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUnUsedExamAttemptsIdInExam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExamAttemptId",
                table: "Exams");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExamAttemptId",
                table: "Exams",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
