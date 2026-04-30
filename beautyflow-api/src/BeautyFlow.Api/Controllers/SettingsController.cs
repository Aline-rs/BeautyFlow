using BeautyFlow.Api.Contracts;
using BeautyFlow.Api.Contracts.Settings;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Domain.Entities;
using BeautyFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Api.Controllers;

[ApiController]
[Authorize]
[Route("settings")]
public sealed class SettingsController : ControllerBase
{
    private const string DefaultTemplateText =
        "Oi, {nome}! Tudo bem?\n\nJa faz {dias} dias desde o servico de {servico} aqui no {salao}.\n\nQue tal agendar um retorno?";

    private readonly BeautyFlowDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public SettingsController(
        BeautyFlowDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    [HttpGet("message-template")]
    [ProducesResponseType(typeof(MessageTemplateDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MessageTemplateDto>> GetMessageTemplate()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var template = await _dbContext.MessageTemplates
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId.Value);

        return Ok(new MessageTemplateDto
        {
            TemplateText = template?.TemplateText ?? DefaultTemplateText
        });
    }

    [HttpPut("message-template")]
    [ProducesResponseType(typeof(MessageTemplateDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MessageTemplateDto>> UpdateMessageTemplate([FromBody] UpdateMessageTemplateRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (string.IsNullOrWhiteSpace(request.TemplateText))
        {
            return BadRequest(ApiResponse<object>.Failure("TemplateText is required."));
        }

        var template = await _dbContext.MessageTemplates
            .FirstOrDefaultAsync(x => x.UserId == userId.Value);

        if (template is null)
        {
            template = new MessageTemplate
            {
                UserId = userId.Value,
                TemplateText = request.TemplateText.Trim()
            };

            _dbContext.MessageTemplates.Add(template);
        }
        else
        {
            template.TemplateText = request.TemplateText.Trim();
            template.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();

        return Ok(new MessageTemplateDto
        {
            TemplateText = template.TemplateText
        });
    }

    [HttpGet("notifications")]
    [ProducesResponseType(typeof(NotificationSettingsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<NotificationSettingsDto>> GetNotifications()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var settings = await _dbContext.NotificationSettings
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId.Value);

        return Ok(MapNotificationSettings(settings));
    }

    [HttpPut("notifications")]
    [ProducesResponseType(typeof(NotificationSettingsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<NotificationSettingsDto>> UpdateNotifications([FromBody] UpdateNotificationSettingsRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        if (!TimeOnly.TryParse(request.PreferredTime, out var preferredTime))
        {
            return BadRequest(ApiResponse<object>.Failure("PreferredTime must be a valid HH:mm value."));
        }

        if (string.IsNullOrWhiteSpace(request.ReminderMode))
        {
            return BadRequest(ApiResponse<object>.Failure("ReminderMode is required."));
        }

        var settings = await _dbContext.NotificationSettings
            .FirstOrDefaultAsync(x => x.UserId == userId.Value);

        if (settings is null)
        {
            settings = new NotificationSettings
            {
                UserId = userId.Value,
                IsEnabled = request.IsEnabled,
                PreferredTime = preferredTime,
                ReminderMode = request.ReminderMode.Trim()
            };

            _dbContext.NotificationSettings.Add(settings);
        }
        else
        {
            settings.IsEnabled = request.IsEnabled;
            settings.PreferredTime = preferredTime;
            settings.ReminderMode = request.ReminderMode.Trim();
            settings.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();

        return Ok(MapNotificationSettings(settings));
    }

    private Guid? GetUserId() => _currentUserService.UserId;

    private static NotificationSettingsDto MapNotificationSettings(NotificationSettings? settings)
    {
        if (settings is null)
        {
            return new NotificationSettingsDto
            {
                IsEnabled = true,
                PreferredTime = "09:00",
                ReminderMode = "OnlyWhenDue"
            };
        }

        return new NotificationSettingsDto
        {
            IsEnabled = settings.IsEnabled,
            PreferredTime = settings.PreferredTime.ToString("HH:mm"),
            ReminderMode = settings.ReminderMode
        };
    }
}
