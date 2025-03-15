namespace OnlineExamSystem.Core.Entities
{
    public class Question : BaseEntity
    {
        public string? Title {  get; set; }
        public int ExamId { get; set; }
        public Exam? Exam { get; set; }
        public ICollection<Option>? Options{ get; set; }
        
    }
}
