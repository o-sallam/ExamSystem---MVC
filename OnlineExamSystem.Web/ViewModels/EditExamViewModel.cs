using System.ComponentModel.DataAnnotations;
using OnlineExamSystem.Web.ViewModels.OnlineExamSystem.Web.ViewModels;

namespace OnlineExamSystem.Web.ViewModels
{
    public class EditExamViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters")]
        public string Description { get; set; } = string.Empty;

        public List<QuestionViewModel> Questions { get; set; } = new List<QuestionViewModel>();
    }
}