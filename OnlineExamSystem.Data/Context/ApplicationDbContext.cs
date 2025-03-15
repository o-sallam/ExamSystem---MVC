using System.Xml;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Core.Identity;

namespace OnlineExamSystem.Data.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Exam system entities
        public DbSet<Exam> Exams { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<ExamAttempt> ExamAttempts { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Option> Options { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>().Ignore(u => u.PhoneNumber);
            modelBuilder.Entity<ApplicationUser>().Ignore(u => u.PhoneNumberConfirmed);
            modelBuilder.Entity<ApplicationUser>().Ignore(u => u.TwoFactorEnabled);
            modelBuilder.Entity<ApplicationUser>().Ignore(u => u.LockoutEnd);
            modelBuilder.Entity<ApplicationUser>().Ignore(u => u.LockoutEnabled);
            modelBuilder.Entity<ApplicationUser>().Ignore(u => u.AccessFailedCount);
            modelBuilder.Entity<ApplicationUser>().Ignore(u => u.Email);
            modelBuilder.Entity<ApplicationUser>().Ignore(u => u.NormalizedEmail);
            modelBuilder.Entity<ApplicationUser>().Ignore(u => u.EmailConfirmed);

            modelBuilder.Entity<ExamAttempt>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                      .ValueGeneratedOnAdd(); // This tells EF Core to auto-increment the key.
            });

            modelBuilder.Entity<Exam>()
                .Property(e => e.CreatedById)
                .HasColumnName("CreatedByUserId");

            // Configure ExamAttempt - adjust to use ApplicationUser
            modelBuilder.Entity<ExamAttempt>()
                .Property(ea => ea.UserId)
                .HasColumnName("UserId");

            modelBuilder.Entity<ExamAttempt>()
                .HasOne(ea => ea.Exam)
                .WithMany(e => e.ExamAttempts)
                .HasForeignKey(ea => ea.ExamId);


            // Configure table names for Identity tables (without schema)
            modelBuilder.Entity<ApplicationUser>().ToTable("Users", "Security");
            modelBuilder.Entity<IdentityRole>().ToTable("Roles", "Security");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles", "Security");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims", "Security");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins", "Security");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims", "Security");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UserTokens", "Security");

        }
    }
}
