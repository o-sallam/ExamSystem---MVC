using System.Reflection.Metadata.Ecma335;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Core.Identity;
using OnlineExamSystem.Core.Interfaces;
using OnlineExamSystem.Data;
using OnlineExamSystem.Web.DTOs;
using OnlineExamSystem.Web.ViewModels;

namespace OnlineExamSystem.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize]
    public class ExamsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public ExamsController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }
        public async Task<IActionResult> Index()
        {
            var exams = await _unitOfWork.Exams.GetExamsForAdminAsync();

            var examViewModels = exams.Select(exam => new AdminExamViewModel
            {
                Id = exam.Id,
                Title = exam.Title,
                Description = exam.Description,
                Questions = exam.Questions,
                Participants = exam.Participants,
                CreatedBy = exam.CreatedBy
            });


            return View(examViewModels);
        }

        public IActionResult Results()
        {
            return View();
        }

        // GET: Admin/Exams/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Admin/Exams/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateExamViewModel model)
        {
            if (ModelState.IsValid)
            {
                var currentUser = await _userManager.GetUserAsync(User);
                if (currentUser == null)
                {
                    return Unauthorized();
                }

                var exam = new Exam
                {
                    Title = model.Title,
                    Description = model.Description,
                    CreatedById = currentUser.Id,
                    CreatedAt = DateTime.UtcNow
                };

                await _unitOfWork.Exams.AddAsync(exam);
                await _unitOfWork.CompleteAsync();

                return RedirectToAction(nameof(Index));
            }

            return View(model);
        }

        // POST: Admin/Exams/CreateWithQuestions
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateWithQuestions([FromBody] CreateExamDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid form data" });
            }

            try
            {
                var currentUser = await _userManager.GetUserAsync(User);
                if (currentUser == null)
                {
                    return Unauthorized();
                }

                // Create the exam
                var exam = new Exam
                {
                    Title = model.Title,
                    Description = model.Description,
                    CreatedById = currentUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Questions = new List<Question>()
                };

                // Add the exam to get its ID
                await _unitOfWork.Exams.AddAsync(exam);
                await _unitOfWork.CompleteAsync();

                // Add questions and options
                foreach (var questionDto in model.Questions)
                {
                    var question = new Question
                    {
                        Title = questionDto.Title,
                        ExamId = exam.Id,
                        Options = new List<Option>()
                    };

                    // Add the question
                    await _unitOfWork.Questions.AddAsync(question);
                    await _unitOfWork.CompleteAsync();

                    // Add options for this question
                    foreach (var optionDto in questionDto.Options)
                    {
                        var option = new Option
                        {
                            Text = optionDto.Text,
                            IsCorrect = optionDto.IsCorrect
                        };

                        // Add the option
                        await _unitOfWork.Options.AddAsync(option);
                    }
                }

                // Save all changes
                await _unitOfWork.CompleteAsync();

                return Json(new { success = true, examId = exam.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: Admin/Exams/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var exam = await _unitOfWork.Exams.GetByIdAsync(id);
            if (exam == null)
            {
                return NotFound();
            }

            var viewModel = new EditExamViewModel
            {
                Id = exam.Id,
                Title = exam.Title,
                Description = exam.Description
            };

            return View(viewModel);
        }

        // GET: Admin/Exams/GetExamWithQuestions/5
        [HttpGet]
        public async Task<IActionResult> GetExamWithQuestions(int id)
        {
            var exam = await _unitOfWork.Exams.GetExamWithQuestionsAsync(id);
            if (exam == null)
            {
                return NotFound();
            }

            // Map the exam data to a format suitable for the client
            var examData = new
            {
                id = exam.Id,
                title = exam.Title,
                description = exam.Description,
                questions = exam.Questions.Select(q => new
                {
                    id = q.Id,
                    title = q.Title,
                    choices = q.Options.ToDictionary(o => o.Id.ToString(), o => o.Text),
                    correctAnswerId = q.Options.FirstOrDefault(o => o.IsCorrect)?.Id.ToString()
                })
            };

            return Json(examData);
        }

        // POST: Admin/Exams/UpdateWithQuestions
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateWithQuestions([FromBody] UpdateExamDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid form data" });
            }

            try
            {
                var exam = await _unitOfWork.Exams.GetByIdAsync(model.Id);
                if (exam == null)
                {
                    return NotFound(new { success = false, message = "Exam not found" });
                }

                // Update exam properties
                exam.Title = model.Title;
                exam.Description = model.Description;

                // Update the exam
                await _unitOfWork.Exams.UpdateAsync(exam);
                await _unitOfWork.CompleteAsync();

                // Process questions and options
                // Implementation depends on your data model and requirements

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // POST: Admin/Exams/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var exam = await _unitOfWork.Exams.GetByIdAsync(id);
                if (exam == null)
                {
                    return NotFound(new { success = false, message = "Exam not found" });
                }

                await _unitOfWork.Exams.DeleteAsync(exam);
                await _unitOfWork.CompleteAsync();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}