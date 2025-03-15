using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OnlineExamSystem.Core.Identity;

namespace OnlineExamSystem.Core.DTOs
{
    public class ExamWithCurrentUserScoreDto
    {
        public int ExamId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal BestScore { get; set; }
        public string CreatedByName {  get; set; } 
        public int Attempts { get; set; }
        public int Questions { get; set; }
    }
}
