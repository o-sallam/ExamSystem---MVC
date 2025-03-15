using Microsoft.EntityFrameworkCore;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Data.Context;

namespace OnlineExamSystem.Data.Repositories
{
    public class QuestionRepository : Repository<Question>, IQuestionRepository
    {
        public QuestionRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<int> CountQuestionsByExamIdAsync(int examId)
        {
            return await _dbContext.Questions
                .CountAsync(q => q.ExamId == examId);
        }
    }
}
