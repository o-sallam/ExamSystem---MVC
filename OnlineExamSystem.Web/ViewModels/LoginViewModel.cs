
using System.ComponentModel.DataAnnotations;
using OnlineExamSystem.Core.Identity;
namespace OnlineExamSystem.Web.ViewModels
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Username is required")]
        [Display(Name = "Username")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}