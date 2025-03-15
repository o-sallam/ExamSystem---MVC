using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OnlineExamSystem.Core.Entities;
using OnlineExamSystem.Core.Interfaces;
using OnlineExamSystem.Data.Context;

namespace OnlineExamSystem.Data.Repositories
{
    public class OptionRepository:Repository<Option>, IOptionRepository
    {
        public OptionRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
