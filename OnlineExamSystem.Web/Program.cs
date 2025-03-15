using OnlineExamSystem.Data.Factory;
using Microsoft.AspNetCore.Identity;
using OnlineExamSystem.Data.Context;
using OnlineExamSystem.Core.Identity;
using Microsoft.AspNetCore.Authentication.Cookies;
using OnlineExamSystem.Data;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllersWithViews();

// Add Identity services
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 3;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders()
.AddDefaultUI();

builder.Services.AddDataServices(builder.Configuration);
builder.Services.AddRazorPages();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events = new CookieAuthenticationEvents
    {
        OnRedirectToLogin = context =>
        {
            if (context.Request.Path.StartsWithSegments("/admin", StringComparison.OrdinalIgnoreCase))
            {
                var redirectUri = "/Admin/Account/Login" + context.Request.QueryString;
                context.Response.Redirect(redirectUri);
            }
            else
            {
                var redirectUri = "/Account/Login" + context.Request.QueryString;
                context.Response.Redirect(redirectUri);
            }
            return Task.CompletedTask;
        }
    };
});

var app = builder.Build();

// Apply database migrations using DbContextFactory
using (var scope = app.Services.CreateScope())
{
    var factory = scope.ServiceProvider.GetRequiredService<DbContextFactory>();
    using (var dbContext = factory.CreateDbContext())
    {
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        string[] roles = new string[] { "Admin", "SuperAdmin", "Student" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
        string adminUserName = "mrali";
        string adminName = "CEO Ali";
        var adminUser = await userManager.FindByNameAsync(adminUserName);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                Name = adminName,
                UserName = adminUserName,
                SecurityStamp = Guid.NewGuid().ToString("D")
            };
            var result = await userManager.CreateAsync(adminUser, "admin123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "SuperAdmin");
            }
            else
            {
                throw new Exception("Error creating default admin user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages();

// Map the Admin area route using MapAreaControllerRoute
app.MapAreaControllerRoute(
    name: "admin",
    areaName: "Admin",
    pattern: "Admin/{controller=Home}/{action=Index}/{id?}")
    .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin,SuperAdmin" })
    .WithStaticAssets();

// Default route
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Exams}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();
