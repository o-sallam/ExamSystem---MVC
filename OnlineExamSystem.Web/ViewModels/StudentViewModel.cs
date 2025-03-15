namespace OnlineExamSystem.Web.ViewModels
{
    public class StudentViewModel
    {
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public int CompletedExams { get; set; }
        public decimal AverageScore { get; set; }
    }
}
