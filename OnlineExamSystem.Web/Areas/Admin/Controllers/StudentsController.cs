using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OnlineExamSystem.Core.Identity;
using OnlineExamSystem.Core.Interfaces;
using OnlineExamSystem.Web.DTOs;
using OnlineExamSystem.Web.ViewModels;

namespace OnlineExamSystem.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize]
    public class StudentsController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;


        private readonly IUnitOfWork _unitOfWork;

        public StudentsController(
            UserManager<ApplicationUser>userManager,
            IUnitOfWork unitOfWork,
            IPasswordHasher<ApplicationUser> passwordHasher)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _passwordHasher = passwordHasher;
        }
        public async Task<IActionResult> Index()
        {
            var studentsInRole = await _userManager.GetUsersInRoleAsync("Student");
            var examAttempts =await  _unitOfWork.ExamAttempts.GetAllAsync();

            var studentExamData = studentsInRole.Select(student => new StudentViewModel
            {
                StudentId = student.Id,
                StudentName = student.Name,
                CompletedExams = examAttempts?.Count(ea => ea.UserId == student.Id) ?? 0,
                AverageScore = examAttempts?.Where(ea => ea.UserId == student.Id)
                                   .Any() == true ? 
                                   examAttempts.Where(ea => ea.UserId == student.Id).Average(ea => ea.Score) : 0

            }).AsEnumerable();

            return View(studentExamData);
        }

        public IActionResult AddStudent()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> AddStudent(AddStudentDto model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (string.IsNullOrWhiteSpace(model.Password))
            {
                ModelState.AddModelError(nameof(model.Password), "Password is required.");
                return View(model);
            }

            var user = new ApplicationUser
            {
                Name = model.FullName,
                UserName = model.Username
                
            };

            // Using CreateAsync overload that hashes the password for you
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Assign the user to the Student role
                var roleResult = await _userManager.AddToRoleAsync(user, "Student");
                
                if (!roleResult.Succeeded)
                {
                    foreach (var error in roleResult.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    return View(model);
                }
                
                TempData["SuccessMessage"] = "Student created successfully!";
                return RedirectToAction(nameof(Index));
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return View(model);
        }

    }
}