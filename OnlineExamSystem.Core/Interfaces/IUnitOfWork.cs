using OnlineExamSystem.Core.Entities;
using Microsoft.AspNetCore.Identity;
using OnlineExamSystem.Core.Identity;
using OnlineExamSystem.Data.Repositories;

namespace OnlineExamSystem.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        
        IExamRepository Exams { get; }
        IQuestionRepository Questions { get; }
        IExamAttemptRepository ExamAttempts { get; }
        IAnswerRepository Answers { get; }
        IOptionRepository Options { get; }
        
        Task<int> CompleteAsync();
    }
}
