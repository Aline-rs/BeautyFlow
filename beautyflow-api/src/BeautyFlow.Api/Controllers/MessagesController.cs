using BeautyFlow.Api.Contracts;
using BeautyFlow.Api.Contracts.Messages;
using BeautyFlow.Application.Abstractions.Auth;
using BeautyFlow.Domain.Entities;
using BeautyFlow.Domain.Enums;
using BeautyFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautyFlow.Api.Controllers;

[ApiController]
[Authorize]
[Route("messages")]
public sealed class MessagesController : ControllerBase
{
    private readonly BeautyFlowDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public MessagesController(
        BeautyFlowDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<ScheduledMessageDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ScheduledMessageDto>>> GetMessages(
        [FromQuery] string? status,
        [FromQuery] string? search)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User is not authenticated."));
        }

        var query = BuildMessagesQuery(userId.Value);

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<MessageStatus>(status, true, out var parsedStatus))
        {
            query = query.Where(x => x.Status == parsedStatus);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim().ToLowerInvariant();
            query = query.Where(x =>
                EF.Functions.ILike(x.Customer.Name, $"%{normalizedSearch}%") ||
                EF.Functions.ILike(x.Service.Name, $"%{normalizedSearch}%"));
        }

        var messages = await query
            .OrderBy(x => x.Status == MessageStatus.Pending ? 0 : 1)
            .ThenBy(x => x.ScheduledForDate)
            .ThenByDescending(x => x.CreatedAtUtc)
            .ToListAsync();

        return Ok(messages.Select(MapMessage).ToList());
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ScheduledMessageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ScheduledMessageDto>> GetMessage(Guid id)
    {
        var message = await GetMessageEntityAsync(id);
        if (message is null)
        {
            return NotFound(ApiResponse<object>.Failure("Message was not found."));
        }

        return Ok(MapMessage(message));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ScheduledMessageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ScheduledMessageDto>> UpdateMessage(Guid id, [FromBody] UpdateScheduledMessageRequest request)
    {
        var message = await GetMessageEntityAsync(id, asNoTracking: false);
        if (message is null)
        {
            return NotFound(ApiResponse<object>.Failure("Message was not found."));
        }

        if (string.IsNullOrWhiteSpace(request.MessageText))
        {
            return BadRequest(ApiResponse<object>.Failure("MessageText is required."));
        }

        message.MessageText = request.MessageText.Trim();
        message.UpdatedAtUtc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return Ok(MapMessage(message));
    }

    [HttpPatch("{id:guid}/mark-as-sent")]
    [ProducesResponseType(typeof(ScheduledMessageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ScheduledMessageDto>> MarkAsSent(Guid id)
    {
        var message = await GetMessageEntityAsync(id, asNoTracking: false);
        if (message is null)
        {
            return NotFound(ApiResponse<object>.Failure("Message was not found."));
        }

        message.Status = MessageStatus.Sent;
        message.SentAtUtc = DateTime.UtcNow;
        message.UpdatedAtUtc = DateTime.UtcNow;
        message.ErrorMessage = null;
        await _dbContext.SaveChangesAsync();

        return Ok(MapMessage(message));
    }

    [HttpPatch("{id:guid}/cancel")]
    [ProducesResponseType(typeof(ScheduledMessageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ScheduledMessageDto>> Cancel(Guid id)
    {
        var message = await GetMessageEntityAsync(id, asNoTracking: false);
        if (message is null)
        {
            return NotFound(ApiResponse<object>.Failure("Message was not found."));
        }

        message.Status = MessageStatus.Canceled;
        message.CanceledAtUtc = DateTime.UtcNow;
        message.UpdatedAtUtc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return Ok(MapMessage(message));
    }

    [HttpGet("{id:guid}/whatsapp-link")]
    [ProducesResponseType(typeof(WhatsappLinkDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<WhatsappLinkDto>> GetWhatsappLink(Guid id)
    {
        var message = await GetMessageEntityAsync(id);
        if (message is null)
        {
            return NotFound(ApiResponse<object>.Failure("Message was not found."));
        }

        var digits = new string(message.Customer.Whatsapp.Where(char.IsDigit).ToArray());
        var url = $"https://wa.me/55{digits}?text={Uri.EscapeDataString(message.MessageText)}";

        return Ok(new WhatsappLinkDto
        {
            Url = url
        });
    }

    private Guid? GetUserId() => _currentUserService.UserId;

    private IQueryable<ScheduledMessage> BuildMessagesQuery(Guid userId)
    {
        return _dbContext.ScheduledMessages
            .Include(x => x.Customer)
            .Include(x => x.Service)
            .Where(x => x.UserId == userId);
    }

    private async Task<ScheduledMessage?> GetMessageEntityAsync(Guid id, bool asNoTracking = true)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return null;
        }

        var query = BuildMessagesQuery(userId.Value);
        if (asNoTracking)
        {
            query = query.AsNoTracking();
        }

        return await query.FirstOrDefaultAsync(x => x.Id == id);
    }

    private static ScheduledMessageDto MapMessage(ScheduledMessage message)
    {
        return new ScheduledMessageDto
        {
            Id = message.Id.ToString(),
            AppointmentId = message.AppointmentId.ToString(),
            CustomerId = message.CustomerId.ToString(),
            CustomerName = message.Customer.Name,
            CustomerWhatsapp = message.Customer.Whatsapp,
            ServiceId = message.ServiceId.ToString(),
            ServiceName = message.Service.Name,
            ScheduledForDate = message.ScheduledForDate.ToString("yyyy-MM-dd"),
            MessageText = message.MessageText,
            Status = CustomersController.MapMessageStatusLabel(message.Status),
            SentAtUtc = message.SentAtUtc?.ToString("O"),
            ErrorMessage = message.ErrorMessage
        };
    }
}
