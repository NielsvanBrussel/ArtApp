using Auctioneer.Server.Data;
using Auctioneer.Server.Middleware;
using Auctioneer.Server.Services;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(x =>
   x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateAudience = false,
        ValidateIssuer = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:JWTSecret").Value!))
};
});
builder.Services.AddSingleton<AppDbContext>();
builder.Services.AddScoped<ICacheService, CacheService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddTransient<TestMiddleware>();

builder.Services.AddHttpClient("artic", (serviceProvider, httpClient) =>
{
    httpClient.DefaultRequestHeaders.Add("AIC-User-Agent", "art-app-test (niels_vanbrussel@hotmail.com)");
    httpClient.DefaultRequestHeaders.Add("user-agent", "art-app-test (niels_vanbrussel@hotmail.com)");
    httpClient.BaseAddress = new Uri("https://api.artic.edu/api/v1/");
});


var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseMiddleware<TestMiddleware>();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
