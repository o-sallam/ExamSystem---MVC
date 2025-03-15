using Microsoft.EntityFrameworkCore;
using OnlineExamSystem.Core.DTOs;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Data.Context;
using OnlineExamSystem.Web.ViewModels;

namespace OnlineExamSystem.Data.Repositories
{
    public class ExamRepository : Repository<Exam>, IExamRepository
    {
        public ExamRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IReadOnlyList<Exam>> GetExamsByCreatorAsync(string creatorId)
        {
            return await _dbContext.Exams
                .Where(e => e.CreatedById == creatorId)
                .OrderByDescending(e => e.CreatedAt ?? DateTime.MinValue)
                .ToListAsync();
        }

        public async Task<Exam?> GetExamWithQuestionsAsync(int examId)
        {
            return await _dbContext.Exams
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(e => e.Id == examId);
        }

        public async Task<List<Question>> GetQuestionsWithOptionsAsync(int examId)
        {
            var data = await _dbContext.Questions
                .Include(q => q.Options)
                .Where(q => q.ExamId == examId)
                .ToListAsync();

            return data;
        }

        public async Task<IReadOnlyList<ExamWithCurrentUserScoreDto>> GetExamsWithCurrentUserScoresAsync(string userId)
        {
            var exams = await _dbContext.Exams
                .Include(e => e.ExamAttempts.Where(ea => ea.UserId == userId))
                .Include(e => e.ExamAttempts)
                .Include(e => e.Questions)
                .Include(e => e.CreatedBy)
                .OrderByDescending(e => e.CreatedAt ?? DateTime.MinValue)
                .ToListAsync();

            var examResults = exams.Select(exam =>
            {
                var bestAttempt = exam.ExamAttempts
                    .OrderByDescending(ea => ea.Score)
                    .FirstOrDefault();

                return new ExamWithCurrentUserScoreDto
                {
                    ExamId = exam.Id,
                    Title = exam.Title,
                    Description = exam.Description,
                    BestScore = bestAttempt?.Score ?? 0,
                    CreatedByName = exam.CreatedBy.Name,
                    Attempts = exam.ExamAttempts.Count,
                    Questions = exam.Questions.Count
                };
            }).ToList();

            return examResults;
        }

        public async Task<IReadOnlyList<AdminExamDto>> GetExamsForAdminAsync()
        {
            var exams = await _dbContext.Exams
                .Include(e => e.Questions)
                .Include(e => e.ExamAttempts)
                .Include(e => e.CreatedBy)
                .OrderByDescending(e => e.CreatedAt ?? DateTime.MinValue)
                .ToListAsync();

            var adminExams = exams.Select(exam => new AdminExamDto
            {
                Id = exam.Id,
                Title = exam.Title,
                Description = exam.Description,
                Questions = exam.Questions.Count,
                Participants = exam.ExamAttempts.Select(ea => ea.UserId).Distinct().Count(),
                CreatedBy = exam.CreatedBy.Name
            }).ToList();

            return adminExams;
        }
    }
}
