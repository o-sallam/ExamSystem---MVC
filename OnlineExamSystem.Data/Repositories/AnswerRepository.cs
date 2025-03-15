using Microsoft.EntityFrameworkCore;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Data.Context;

namespace OnlineExamSystem.Data.Repositories
{
    public class AnswerRepository : Repository<Answer>,IAnswerRepository
    {
        public AnswerRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IReadOnlyList<Answer>> GetAnswersByExamAttemptIdAsync(int examAttemptId)
        {
            return await _dbContext.Answers
                .Where(a => a.ExamAttemptId == examAttemptId)
                .Include(a => a.Question)
                .Include(a => a.SelectedOption)
                .ToListAsync();
        }

        public async Task<Answer?> GetAnswerForQuestionInAttemptAsync(int examAttemptId, int questionId)
        {
            return await _dbContext.Answers
                .FirstOrDefaultAsync(a => a.ExamAttemptId == examAttemptId && a.QuestionId == questionId);
        }

    }
}
