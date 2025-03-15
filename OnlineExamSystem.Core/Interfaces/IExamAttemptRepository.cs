using Microsoft.EntityFrameworkCore;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Core.Interfaces;

namespace OnlineExamSystem.Data.Repositories
{
    public interface IExamAttemptRepository:IRepository<ExamAttempt>
    {
        // Add specialized methods for ExamAttempt entity
        Task<IReadOnlyList<ExamAttempt>> GetAttemptsByUserIdAsync(string userId);


         Task<IReadOnlyList<ExamAttempt>> GetAttemptsByExamIdAsync(int examId);


          Task<ExamAttempt?> GetExamAttemptWithAnswersAsync(int attemptId);


          Task<decimal> GetUserHighestScoringExamAttemptAsync(string userId, int examId);


          Task<decimal> GetUserHighestScoringExamAttemptByUsernameAsync(string userName);

    }
}
