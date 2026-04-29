using BeautyFlow.Application.Abstractions.Messaging;

namespace BeautyFlow.Infrastructure.Messaging;

public sealed class DefaultMessageTemplateRenderer : IMessageTemplateRenderer
{
    public string RenderFollowUpMessage(
        string salonName,
        string customerName,
        string serviceName,
        int suggestedReturnDays,
        DateOnly appointmentDate)
    {
        return
            $"Oi, {customerName}! Tudo bem? " +
            $"Ja faz {suggestedReturnDays} dias desde o servico de {serviceName} aqui no {salonName}. " +
            "Que tal agendar um retorno?";
    }
}
