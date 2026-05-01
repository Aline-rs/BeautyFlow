export type Appointment = {
  id: string;
  customerId: string;
  customerName: string;
  customerInitials: string;
  customerPhotoUrl?: string;
  serviceId: string;
  serviceName: string;
  serviceIds: string[];
  serviceNames: string[];
  contextSalonId?: string | null;
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
  serviceIds: string[];
  appointmentDate: string;
  notes?: string;
};

export type UpdateAppointmentPayload = CreateAppointmentPayload;

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
