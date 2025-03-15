using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Core.Interfaces;

namespace OnlineExamSystem.Data.Repositories
{
    public interface IQuestionRepository:IRepository<Question>
    {
        Task<int> CountQuestionsByExamIdAsync(int examId);
    }
}