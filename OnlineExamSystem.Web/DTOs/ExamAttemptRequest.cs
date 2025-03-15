namespace OnlineExamSystem.Web.DTOs
{
    public class ExamAttemptRequest
    {
        public int ExamId { get; set; }
        public decimal Score { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public ICollection<AnswerDto> Answers { get; set; } // or List<string> if answers are strings
    }

    public class AnswerDto
    {
        public int QuestionId { get; set; }
        public int selectedAnswerId { get; set; }
    }
}
