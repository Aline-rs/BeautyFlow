using BeautyFlow.Api.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace BeautyFlow.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult<ApiResponse<object>> Get()
    {
        return Ok(ApiResponse<object>.Success(new { status = "ok" }));
    }
}
