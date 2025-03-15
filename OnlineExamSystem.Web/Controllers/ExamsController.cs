using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.Build.Framework;
using Microsoft.VisualBasic;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Core.Identity;
using OnlineExamSystem.Core.Interfaces;
using OnlineExamSystem.Web.DTOs;
using OnlineExamSystem.Web.ViewModels;
using OnlineExamSystem.Web.ViewModels.OnlineExamSystem.Web.ViewModels;

namespace OnlineExamSystem.Controllers
{
    [Authorize]
    public class ExamsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;


        public ExamsController(
            UserManager<ApplicationUser> userManager, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
        }

        public async Task<IActionResult> Index()
        {

            var userId = _userManager.GetUserId(User);

            var exams = await _unitOfWork.Exams.GetExamsWithCurrentUserScoresAsync(userId);

            var model = exams.Select(ex => new ExamViewModel
            {
                Id = ex.ExamId,
                Title = ex.Title,
                Description = ex.Description,
                CreatedBy = ex.CreatedByName,
                CurrentUserScore=ex.BestScore,
                Attempts=ex.Attempts,
                Questions=ex.Questions,
            });

            return View(model);
        }


        public async Task<IActionResult> Questions(int id)
        {
            var currentUserId=_userManager.GetUserId(User);
            var examAttempts= await _unitOfWork.ExamAttempts.GetAttemptsByExamIdAsync(id);
            var isExamAttemptedByCurrentUser = examAttempts
                .Where(at => at.UserId == currentUserId).Any();
            if (isExamAttemptedByCurrentUser)
                return RedirectToAction("Index");

            var questions = await _unitOfWork.Exams.GetQuestionsWithOptionsAsync(id);
            var questionViewModels = questions.Select(q => new QuestionViewModel
            {
                ExamId = id,
                Id = q.Id,
                Title = q.Title,
                Choices = q.Options.ToDictionary(o => o.Id.ToString(), o => o.Text),
                CorrectAnswerId = q.Options.FirstOrDefault(o => o.IsCorrect)?.Id.ToString()

            }).ToList();

            return View(questionViewModels);
        }

        [HttpPost]
        public async Task<IActionResult> SubmitExamResult([FromBody] ExamAttemptRequest submissionData)
        {
            var currentUserId =  _userManager.GetUserId(User);

            var attempt = new ExamAttempt
            {
                ExamId=submissionData.ExamId,
                IsCompleted=true,
                StartTime = submissionData.StartTime,
                EndTime = submissionData.EndTime,
                Score = submissionData.Score,
                UserId = currentUserId,
            };

            await _unitOfWork.ExamAttempts.AddAsync( attempt);
            await _unitOfWork.CompleteAsync();

            return Ok(submissionData);
        }

    }

}

