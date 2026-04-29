namespace BeautyFlow.Application.Abstractions.Messaging;

public interface IMessageTemplateRenderer
{
    string RenderFollowUpMessage(
        string salonName,
        string customerName,
        string serviceName,
        int suggestedReturnDays,
        DateOnly appointmentDate);
}
