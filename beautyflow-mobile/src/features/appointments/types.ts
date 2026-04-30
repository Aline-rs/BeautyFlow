export type Appointment = {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  contextLabel: string;
  appointmentDate: string;
  notes?: string;
  scheduledMessageId: string;
  scheduledForDate: string;
  messageStatus: 'Pendente' | 'Enviada' | 'Cancelada' | 'Erro';
  messageText: string;
};

export type CreateAppointmentPayload = {
  customerId: string;
  serviceId: string;
  appointmentDate: string;
  notes?: string;
};

export type ScheduledMessage = {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  customerWhatsapp: string;
  serviceId: string;
  serviceName: string;
  contextLabel: string;
  scheduledForDate: string;
  messageText: string;
  status: 'Pendente' | 'Enviada' | 'Cancelada' | 'Erro';
  sentAtUtc?: string;
  errorMessage?: string;
};
