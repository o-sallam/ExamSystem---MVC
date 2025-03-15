using OnlineExamSystem.Core.Entities;


namespace OnlineExamSystem.Web.ViewModels
{
    public class ExamViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
        public int Questions { get; set; }
        public int Attempts { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal CurrentUserScore { get; set; }
    }

}