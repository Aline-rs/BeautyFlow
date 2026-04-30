using BeautyFlow.Application.Models.Appointments;

namespace BeautyFlow.Application.Abstractions.Appointments;

public interface IAppointmentService
{
    Task<AppointmentRegistrationResult> RegisterAppointmentAsync(
        Guid userId,
        Guid? salonId,
        CreateAppointmentInput input,
        CancellationToken cancellationToken = default);
}
