using Microsoft.EntityFrameworkCore;
using OnlineExamSystem.Core.DTOs;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Core.Interfaces;
using OnlineExamSystem.Web.ViewModels;

namespace OnlineExamSystem.Data.Repositories
{
    public interface IExamRepository:IRepository<Exam>
    {
        Task<IReadOnlyList<Exam>> GetExamsByCreatorAsync(string creatorId);

        Task<Exam?> GetExamWithQuestionsAsync(int examId);


        Task<List<Question>> GetQuestionsWithOptionsAsync(int examId);


        Task<IReadOnlyList<ExamWithCurrentUserScoreDto>> GetExamsWithCurrentUserScoresAsync(string userId);
        Task<IReadOnlyList<AdminExamDto>> GetExamsForAdminAsync();

    }
}