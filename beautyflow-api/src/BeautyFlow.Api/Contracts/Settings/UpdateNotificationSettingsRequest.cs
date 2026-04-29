namespace BeautyFlow.Api.Contracts.Settings;

public sealed class UpdateNotificationSettingsRequest
{
    public bool IsEnabled { get; init; }
    public string PreferredTime { get; init; } = "09:00";
    public string ReminderMode { get; init; } = "OnlyWhenDue";
}
