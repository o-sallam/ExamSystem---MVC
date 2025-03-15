using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OnlineExamSystem.Core.Interfaces;
using OnlineExamSystem.Data.Context;
using OnlineExamSystem.Data.Factory;

namespace OnlineExamSystem.Data
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDataServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register DbContext with SQLite
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(
                    configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            // Register DbContextFactory
            services.AddSingleton<DbContextFactory>();

            // Register Repositories
            services.AddTransient<IUnitOfWork,UnitOfWork>();

            // Register Unit of Work - note that UserManager is registered by Identity services
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }

    }
}
