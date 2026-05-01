import { AxiosError } from 'axios';
import { api } from '../../lib/api/client';
import { fetchCustomerById, syncMockCustomerAfterAppointment, syncMockCustomerAfterAppointmentMutation } from '../customers/customersService';
import { fetchServiceById } from '../services/servicesService';
import { mockAppointments, mockMessages, prependMockAppointment, prependMockMessage, replaceMockAppointment, replaceMockMessage } from './mockStore';
import { Appointment, CreateAppointmentPayload, ScheduledMessage, UpdateAppointmentPayload } from './types';

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

function pickTriggerService<T extends { suggestedReturnDays: number; name: string }>(services: T[]) {
  return [...services].sort((left, right) => {
    if (right.suggestedReturnDays !== left.suggestedReturnDays) {
      return right.suggestedReturnDays - left.suggestedReturnDays;
    }

    return left.name.localeCompare(right.name);
  })[0];
}

function buildFollowUpMessageText(customerName: string, serviceName: string, suggestedReturnDays: number) {
  return `Oi, ${customerName}! Tudo bem? Ja faz ${suggestedReturnDays} dias desde ${serviceName.toLowerCase()}. Que tal agendar um retorno?`;
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

export async function fetchAppointmentById(appointmentId: string): Promise<Appointment | null> {
  try {
    const response = await api.get<Appointment>(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return mockAppointments.find((appointment) => appointment.id === appointmentId) ?? null;
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

    const triggerService = pickTriggerService(services);

    const serviceNames = services.map((service) => service.name);
    const serviceIds = services.map((service) => service.id);
    const suggestedReturnDays = triggerService.suggestedReturnDays;
    const scheduledForDate = addDaysToIsoDate(payload.appointmentDate, suggestedReturnDays);
    const customerName = customer?.name ?? 'Cliente selecionada';
    const customerWhatsapp = customer?.whatsapp ?? '(31) 90000-0000';
    const contextLabel = customer?.contextLabel ?? 'Conta profissional';
    const messageText = buildFollowUpMessageText(customerName, triggerService.name, suggestedReturnDays);

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

export async function updateAppointment(
  appointmentId: string,
  payload: UpdateAppointmentPayload,
): Promise<Appointment> {
  try {
    const response = await api.put<Appointment>(`/appointments/${appointmentId}`, payload);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const previousAppointment = mockAppointments.find((appointment) => appointment.id === appointmentId);
    if (!previousAppointment) {
      throw new Error('Atendimento nao encontrado.');
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

    const triggerService = pickTriggerService(services);
    const serviceNames = services.map((service) => service.name);
    const serviceIds = services.map((service) => service.id);
    const suggestedReturnDays = triggerService.suggestedReturnDays;
    const scheduledForDate = addDaysToIsoDate(payload.appointmentDate, suggestedReturnDays);
    const customerName = customer?.name ?? previousAppointment.customerName;
    const customerWhatsapp = customer?.whatsapp ?? '(31) 90000-0000';
    const contextLabel = customer?.contextLabel ?? previousAppointment.contextLabel;
    const messageText = buildFollowUpMessageText(customerName, triggerService.name, suggestedReturnDays);

    const nextAppointment: Appointment = {
      ...previousAppointment,
      customerId: payload.customerId,
      customerName,
      customerInitials: customer?.initials ?? previousAppointment.customerInitials,
      customerPhotoUrl: customer?.photoUrl,
      serviceId: triggerService.id,
      serviceName: triggerService.name,
      serviceIds,
      serviceNames,
      contextSalonId: customer?.contextSalonId ?? null,
      contextLabel,
      appointmentDate: payload.appointmentDate,
      notes: payload.notes,
      scheduledForDate,
      messageText,
    };

    const previousMessage = mockMessages.find((message) => message.id === previousAppointment.scheduledMessageId);
    const nextMessage: ScheduledMessage = {
      id: previousMessage?.id ?? previousAppointment.scheduledMessageId,
      appointmentId,
      customerId: payload.customerId,
      customerName,
      customerWhatsapp,
      serviceId: triggerService.id,
      serviceName: triggerService.name,
      contextLabel,
      scheduledForDate,
      messageText,
      status: previousMessage?.status ?? previousAppointment.messageStatus,
      sentAtUtc: previousMessage?.sentAtUtc,
      errorMessage: previousMessage?.errorMessage,
    };

    replaceMockAppointment(appointmentId, nextAppointment);
    replaceMockMessage(nextMessage.id, nextMessage);
    syncMockCustomerAfterAppointmentMutation(
      {
        appointmentId,
        customerId: payload.customerId,
        serviceName: triggerService.name,
        serviceNames,
        contextLabel,
        appointmentDate: payload.appointmentDate,
        nextContactDate: scheduledForDate,
        messageStatus: nextAppointment.messageStatus,
      },
      {
        appointmentId: previousAppointment.id,
        customerId: previousAppointment.customerId,
        serviceName: previousAppointment.serviceName,
        serviceNames: previousAppointment.serviceNames,
        contextLabel: previousAppointment.contextLabel,
        appointmentDate: previousAppointment.appointmentDate,
        nextContactDate: previousAppointment.scheduledForDate,
        messageStatus: previousAppointment.messageStatus,
      },
    );

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
