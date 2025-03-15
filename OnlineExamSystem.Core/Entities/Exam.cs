using OnlineExamSystem.Core.Identity;

namespace OnlineExamSystem.Core.Entities
{
    public class Exam : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CreatedById { get; set; } = string.Empty;
        public ApplicationUser? CreatedBy { get; set; }
        public ICollection<Question>? Questions { get; set; }
        public virtual ICollection<ExamAttempt>? ExamAttempts { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
