using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Core.Interfaces;
using OnlineExamSystem.Data.Context;
using OnlineExamSystem.Data.Repositories;
using Microsoft.AspNetCore.Identity;
using OnlineExamSystem.Core.Identity;
using Microsoft.Extensions.Options;

namespace OnlineExamSystem.Data
{
    public class UnitOfWork : IUnitOfWork
    {
       private readonly ApplicationDbContext _dbContext;

       public IExamRepository? Exams { get; private set; }
       public IQuestionRepository? Questions { get; private set; }
        public IExamAttemptRepository? ExamAttempts { get; private set; }
        public IAnswerRepository? Answers { get; private set; }
        public IOptionRepository? Options { get; private set; }
        public bool _disposed;

        public UnitOfWork(
            ApplicationDbContext dbContext)
        {
            _dbContext = dbContext ;

            Exams = new ExamRepository(dbContext);
            Questions = new QuestionRepository(dbContext);
            ExamAttempts = new ExamAttemptRepository(dbContext);
            Answers = new AnswerRepository(dbContext);
            Options = new OptionRepository(dbContext);
        }


        public async Task<int> CompleteAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _dbContext.Dispose();
                }
            }
            _disposed = true;
        }
    }
}
