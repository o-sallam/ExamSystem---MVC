namespace OnlineExamSystem.Web.ViewModels
{
    public class AdminExamViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Questions { get; set; } // Count of exam questions
        public int Participants { get; set; } // Count of students who took the exam
        public string CreatedBy { get; set; } = string.Empty; // Name of the creator
    }
}