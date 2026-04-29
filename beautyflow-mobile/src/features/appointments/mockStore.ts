import { Appointment, ScheduledMessage } from './types';

const today = new Date();

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

export let mockAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    customerId: 'customer-1',
    customerName: 'Gabriela Alves',
    serviceId: 'service-1',
    serviceName: 'Mechas',
    appointmentDate: toIsoDate(addDays(today, -15)),
    notes: 'Fez mechas loiras e matizacao.',
    scheduledMessageId: 'message-1',
    scheduledForDate: toIsoDate(today),
    messageStatus: 'Pendente',
    messageText: 'Oi, Gabriela! Tudo bem? Ja faz 15 dias desde suas mechas. Que tal agendar um retorno?',
  },
  {
    id: 'appointment-2',
    customerId: 'customer-1',
    customerName: 'Gabriela Alves',
    serviceId: 'service-4',
    serviceName: 'Hidratacao',
    appointmentDate: toIsoDate(addDays(today, -30)),
    notes: 'Mascara reconstrutora.',
    scheduledMessageId: 'message-2',
    scheduledForDate: toIsoDate(addDays(today, -15)),
    messageStatus: 'Enviada',
    messageText: 'Oi, Gabriela! Ja faz 15 dias desde a hidratacao. Vamos marcar seu retorno?',
  },
  {
    id: 'appointment-3',
    customerId: 'customer-2',
    customerName: 'Juliana Martins',
    serviceId: 'service-2',
    serviceName: 'Coloracao',
    appointmentDate: toIsoDate(addDays(today, -30)),
    notes: 'Retocou a raiz.',
    scheduledMessageId: 'message-3',
    scheduledForDate: toIsoDate(today),
    messageStatus: 'Pendente',
    messageText: 'Oi, Juliana! Ja faz alguns dias desde sua coloracao. Que tal agendar um retorno?',
  },
];

export let mockMessages: ScheduledMessage[] = [
  {
    id: 'message-1',
    appointmentId: 'appointment-1',
    customerId: 'customer-1',
    customerName: 'Gabriela Alves',
    customerWhatsapp: '(31) 99999-9999',
    serviceId: 'service-1',
    serviceName: 'Mechas',
    scheduledForDate: toIsoDate(today),
    messageText: 'Oi, Gabriela! Tudo bem? Ja faz 15 dias desde suas mechas. Que tal agendar um retorno?',
    status: 'Pendente',
  },
  {
    id: 'message-2',
    appointmentId: 'appointment-2',
    customerId: 'customer-1',
    customerName: 'Gabriela Alves',
    customerWhatsapp: '(31) 99999-9999',
    serviceId: 'service-4',
    serviceName: 'Hidratacao',
    scheduledForDate: toIsoDate(addDays(today, -15)),
    messageText: 'Oi, Gabriela! Ja faz 15 dias desde a hidratacao. Vamos marcar seu retorno?',
    status: 'Enviada',
    sentAtUtc: addDays(today, -15).toISOString(),
  },
  {
    id: 'message-3',
    appointmentId: 'appointment-3',
    customerId: 'customer-2',
    customerName: 'Juliana Martins',
    customerWhatsapp: '(31) 98888-1111',
    serviceId: 'service-2',
    serviceName: 'Coloracao',
    scheduledForDate: toIsoDate(today),
    messageText: 'Oi, Juliana! Ja faz alguns dias desde sua coloracao. Que tal agendar um retorno?',
    status: 'Pendente',
  },
  {
    id: 'message-4',
    appointmentId: 'appointment-4',
    customerId: 'customer-3',
    customerName: 'Carla Souza',
    customerWhatsapp: '(31) 97777-2222',
    serviceId: 'service-3',
    serviceName: 'Escova',
    scheduledForDate: toIsoDate(addDays(today, -1)),
    messageText: 'Oi, Carla! Seu retorno de escova esta disponivel.',
    status: 'Erro',
    errorMessage: 'Falha simulada de envio.',
  },
];

export function prependMockAppointment(appointment: Appointment) {
  mockAppointments = [appointment, ...mockAppointments];
}

export function prependMockMessage(message: ScheduledMessage) {
  mockMessages = [message, ...mockMessages];
}

export function replaceMockMessage(messageId: string, nextMessage: ScheduledMessage) {
  mockMessages = mockMessages.map((message) =>
    message.id === messageId ? nextMessage : message,
  );
}
