using Microsoft.AspNetCore.Identity;

namespace OnlineExamSystem.Core.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } = string.Empty;
    }
}
