namespace BeautyFlow.Api.Contracts.Messages;

public sealed class UpdateScheduledMessageRequest
{
    public string MessageText { get; init; } = string.Empty;
}
