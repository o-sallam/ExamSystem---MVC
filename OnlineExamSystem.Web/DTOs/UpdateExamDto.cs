using System.ComponentModel.DataAnnotations;

namespace OnlineExamSystem.Web.DTOs
{
    public class UpdateExamDto:CreateExamDto
    {
        [Required]
        public int Id { get; set; }
    }


}