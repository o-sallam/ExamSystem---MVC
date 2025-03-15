using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OnlineExamSystem.Data.Context;

namespace OnlineExamSystem.Data.Factory
{
    public class DbContextFactory
    {
        private readonly IConfiguration _configuration;

        public DbContextFactory(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public ApplicationDbContext CreateDbContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            
            // Get the connection string from appsettings.json
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            
            // Configure SQLite with identity support
            optionsBuilder.UseSqlite(connectionString, options =>
            {
                options.MigrationsAssembly("OnlineExamSystem.Data");
            });

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
