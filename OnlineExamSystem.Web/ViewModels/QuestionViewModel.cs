using Microsoft.EntityFrameworkCore.Sqlite.Query.Internal;

namespace OnlineExamSystem.Web.ViewModels
{
    namespace OnlineExamSystem.Web.ViewModels
    {


        public class QuestionViewModel
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public Dictionary<string, string> Choices { get; set; }
            public string CorrectAnswerId { get; set; }
            public int ExamId { get; set; }
        }
    }

}

