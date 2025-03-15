using Microsoft.EntityFrameworkCore;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Core.Interfaces;

namespace OnlineExamSystem.Data.Repositories
{
    public interface IAnswerRepository:IRepository<Answer>
    {
        Task<IReadOnlyList<Answer>> GetAnswersByExamAttemptIdAsync(int examAttemptId);

        Task<Answer?> GetAnswerForQuestionInAttemptAsync(int examAttemptId, int questionId);
    }
}