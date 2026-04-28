using BeautyFlow.Api.Extensions;
using BeautyFlow.Api.Middleware;
using BeautyFlow.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddBeautyFlowSwagger();
builder.Services.AddBeautyFlowAuthentication(builder.Configuration);
builder.Services.AddBeautyFlowInfrastructure(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
