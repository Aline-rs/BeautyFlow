using System.Net;
using System.Text.Json;
using BeautyFlow.Api.Contracts;

namespace BeautyFlow.Api.Middleware;

public sealed class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unhandled exception while processing request");

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var payload = ApiResponse<object>.Failure(
                "An unexpected error occurred.",
                exception.Message);

            await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
        }
    }
}
