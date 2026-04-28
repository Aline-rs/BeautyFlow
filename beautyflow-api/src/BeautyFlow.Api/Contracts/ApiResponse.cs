namespace BeautyFlow.Api.Contracts;

public sealed class ApiResponse<T>
{
    public bool Succeeded { get; init; }
    public T? Data { get; init; }
    public string? Message { get; init; }
    public IReadOnlyList<string> Errors { get; init; } = [];

    public static ApiResponse<T> Success(T? data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Succeeded = true,
            Data = data,
            Message = message
        };
    }

    public static ApiResponse<T> Failure(string message, params string[] errors)
    {
        return new ApiResponse<T>
        {
            Succeeded = false,
            Message = message,
            Errors = errors
        };
    }
}
