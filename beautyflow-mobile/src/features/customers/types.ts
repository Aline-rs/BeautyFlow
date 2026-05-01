export type ContactPreference = 'WhatsApp' | 'Ligacao' | 'SMS';

export type CustomerHistoryItem = {
  id: string;
  serviceName: string;
  contextLabel: string;
  appointmentDate: string;
  messageStatus: 'Pendente' | 'Enviada' | 'Cancelada' | 'Erro';
  nextContactDate?: string;
};

export type Customer = {
  id: string;
  name: string;
  whatsapp: string;
  contextSalonId?: string | null;
  contextLabel: string;
  birthDate?: string;
  contactPreference: ContactPreference;
  notes?: string;
  photoUrl?: string;
  initials: string;
  nextServiceName?: string;
  nextContactDate?: string;
  lastAppointmentLabel?: string;
  history: CustomerHistoryItem[];
};

export type CustomerFormPayload = {
  name: string;
  whatsapp: string;
  salonId?: string;
  salonLabel?: string;
  birthDate?: string;
  contactPreference: ContactPreference;
  notes?: string;
  photoUrl?: string;
};
