namespace OnlineExamSystem.Core.Entities
{
    public class Answer : BaseEntity
    {
        public int QuestionId { get; set; }
        public Question? Question { get; set; }
        public int SelectedOptionId { get; set; }
        public Option? SelectedOption { get; set; }
        public int ExamAttemptId {  get; set; }    
        public ExamAttempt ExamAttempt { get; set; }

    }
}
