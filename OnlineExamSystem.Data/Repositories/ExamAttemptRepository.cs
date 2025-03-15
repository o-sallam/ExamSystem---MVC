using Microsoft.EntityFrameworkCore;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Data.Context;

namespace OnlineExamSystem.Data.Repositories
{
    public class ExamAttemptRepository : Repository<ExamAttempt>, IExamAttemptRepository
    {
        public ExamAttemptRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        // Add specialized methods for ExamAttempt entity
        public async Task<IReadOnlyList<ExamAttempt>> GetAttemptsByUserIdAsync(string userId)
        {
            return await _dbContext.ExamAttempts
                .Where(ea => ea.UserId == userId)
                .Include(ea => ea.Exam)
                .OrderByDescending(ea => ea.StartTime)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<ExamAttempt>> GetAttemptsByExamIdAsync(int examId)
        {
            return await _dbContext.ExamAttempts
                .Where(ea => ea.ExamId == examId)
                .Include(ea => ea.User)
                .OrderByDescending(ea => ea.StartTime)
                .ToListAsync();
        }

        public async Task<ExamAttempt?> GetExamAttemptWithAnswersAsync(int attemptId)
        {
            return await _dbContext.ExamAttempts
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.Question)
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.SelectedOption)
                .FirstOrDefaultAsync(ea => ea.Id == attemptId);
        }

        public async Task<decimal> GetUserHighestScoringExamAttemptAsync(string userId, int examId)
        {
            var result= await _dbContext.ExamAttempts
                .Where(ea => ea.UserId == userId && ea.ExamId == examId)
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.Question)
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.SelectedOption)
                .OrderByDescending(ea => ea.Score)
                .FirstOrDefaultAsync();

            return result.Score;
        }

        public async Task<decimal> GetUserHighestScoringExamAttemptByUsernameAsync(string userName)
        {
            var result = await _dbContext.ExamAttempts
                .Where(ea => ea.User.UserName == userName)
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.Question)
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.SelectedOption)
                .OrderByDescending(ea => ea.Score)
                .FirstOrDefaultAsync();

            return result.Score;
        }
    }
}
