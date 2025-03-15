using OnlineExamSystem.Core.Identity;

namespace OnlineExamSystem.Core.Entities
{
    public class ExamAttempt : BaseEntity
    {
        public int ExamId { get; set; }
        public Exam? Exam { get; set; }
        
        public string UserId { get; set; } = string.Empty;
        
        public ApplicationUser? User { get; set; }
        
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public decimal Score { get; set; }
        public bool IsCompleted { get; set; }
        
        public ICollection<Answer>? Answers { get; set; }
    }
}
