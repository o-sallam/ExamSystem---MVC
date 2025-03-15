using System.ComponentModel.DataAnnotations;

namespace OnlineExamSystem.Web.DTOs
{
    public class UpdateExamDto
    {
        [Required]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters")]
        public string Description { get; set; } = string.Empty;

        public List<QuestionDto> Questions { get; set; } = new List<QuestionDto>();
    }
}