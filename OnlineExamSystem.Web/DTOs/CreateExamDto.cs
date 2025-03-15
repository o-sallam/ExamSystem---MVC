using System.ComponentModel.DataAnnotations;

namespace OnlineExamSystem.Web.DTOs
{
    public class CreateExamDto
    {
        [Required]
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters")]
        public string Description { get; set; } = string.Empty;

        public List<QuestionDto> Questions { get; set; } = new List<QuestionDto>();
    }

    public class QuestionDto
    {
        [Required]
        [StringLength(200, ErrorMessage = "Question title cannot be longer than 200 characters")]
        public string Title { get; set; } = string.Empty;

        public List<OptionDto> Options { get; set; } = new List<OptionDto>();
    }

    public class OptionDto
    {
        [Required]
        [StringLength(200, ErrorMessage = "Option text cannot be longer than 200 characters")]
        public string Text { get; set; } = string.Empty;

        public bool IsCorrect { get; set; }
    }
}