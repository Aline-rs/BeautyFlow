import { AxiosError } from 'axios';
import { api } from '../../lib/api/client';
import { fetchCustomerById, syncMockCustomerAfterAppointment } from '../customers/customersService';
import { fetchServiceById } from '../services/servicesService';
import { mockAppointments, prependMockAppointment, prependMockMessage } from './mockStore';
import { Appointment, CreateAppointmentPayload, ScheduledMessage } from './types';

function shouldFallback(error: unknown) {
  if (!__DEV__) {
    return false;
  }

  const axiosError = error as AxiosError | undefined;
  const status = axiosError?.response?.status;

  return !status || status === 404 || status >= 500;
}

function addDaysToIsoDate(date: string, days: number) {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

export async function fetchAppointments(search?: string): Promise<Appointment[]> {
  try {
    const response = await api.get<Appointment[]>('/appointments', {
      params: search ? { search } : undefined,
    });
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const normalizedSearch = search?.trim().toLowerCase();
    if (!normalizedSearch) {
      return mockAppointments;
    }

    return mockAppointments.filter(
      (appointment) =>
        appointment.customerName.toLowerCase().includes(normalizedSearch) ||
        appointment.serviceName.toLowerCase().includes(normalizedSearch),
    );
  }
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
  try {
    const response = await api.post<Appointment>('/appointments', payload);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const customer = await fetchCustomerById(payload.customerId);
    const services = (
      await Promise.all(
        payload.serviceIds.map(async (serviceId) => fetchServiceById(serviceId)),
      )
    ).filter((service): service is NonNullable<typeof service> => Boolean(service));

    if (services.length === 0) {
      throw new Error('Servico nao encontrado.');
    }

    const triggerService = [...services].sort((left, right) => {
      if (right.suggestedReturnDays !== left.suggestedReturnDays) {
        return right.suggestedReturnDays - left.suggestedReturnDays;
      }

      return left.name.localeCompare(right.name);
    })[0];

    const serviceNames = services.map((service) => service.name);
    const serviceIds = services.map((service) => service.id);
    const suggestedReturnDays = triggerService.suggestedReturnDays;
    const scheduledForDate = addDaysToIsoDate(payload.appointmentDate, suggestedReturnDays);
    const customerName = customer?.name ?? 'Cliente selecionada';
    const customerWhatsapp = customer?.whatsapp ?? '(31) 90000-0000';
    const contextLabel = customer?.contextLabel ?? 'Conta profissional';
    const messageText = `Oi, ${customerName}! Tudo bem? Ja faz ${suggestedReturnDays} dias desde ${triggerService.name.toLowerCase()}. Que tal agendar um retorno?`;

    const nextMessage: ScheduledMessage = {
      id: `message-${Date.now()}`,
      appointmentId: `appointment-${Date.now()}`,
      customerId: payload.customerId,
      customerName,
      customerWhatsapp,
      serviceId: triggerService.id,
      serviceName: triggerService.name,
      contextLabel,
      scheduledForDate,
      messageText,
      status: 'Pendente',
    };

    const nextAppointment: Appointment = {
      id: nextMessage.appointmentId,
      customerId: payload.customerId,
      customerName,
      customerInitials: customer?.initials ?? buildInitials(customerName),
      customerPhotoUrl: customer?.photoUrl,
      serviceId: triggerService.id,
      serviceName: triggerService.name,
      serviceIds,
      serviceNames,
      contextSalonId: customer?.contextSalonId ?? null,
      contextLabel,
      appointmentDate: payload.appointmentDate,
      notes: payload.notes,
      scheduledMessageId: nextMessage.id,
      scheduledForDate,
      messageStatus: 'Pendente',
      messageText,
    };

    prependMockAppointment(nextAppointment);
    prependMockMessage(nextMessage);
    syncMockCustomerAfterAppointment({
      appointmentId: nextAppointment.id,
      customerId: payload.customerId,
      serviceName: triggerService.name,
      serviceNames,
      contextLabel,
      appointmentDate: payload.appointmentDate,
      nextContactDate: scheduledForDate,
      messageStatus: 'Pendente',
    });
    return nextAppointment;
  }
}

function buildInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
