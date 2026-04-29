import { Customer } from './types';

export const mockCustomers: Customer[] = [
  {
    id: 'customer-1',
    name: 'Gabriela Alves',
    whatsapp: '(31) 99999-9999',
    birthDate: '1994-07-16',
    contactPreference: 'WhatsApp',
    notes: 'Alergica a amonia. Prefere mechas balayage e finalizacao com ondas.',
    photoUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=180&h=180&fit=crop&crop=face',
    initials: 'GA',
    nextServiceName: 'Mechas',
    nextContactDate: '2026-04-16',
    lastAppointmentLabel: 'Mechas - 01/04/2026',
    history: [
      {
        id: 'history-1',
        serviceName: 'Mechas',
        appointmentDate: '2026-04-01',
        messageStatus: 'Pendente',
        nextContactDate: '2026-04-16',
      },
      {
        id: 'history-2',
        serviceName: 'Hidratacao',
        appointmentDate: '2026-03-15',
        messageStatus: 'Enviada',
      },
    ],
  },
  {
    id: 'customer-2',
    name: 'Juliana Martins',
    whatsapp: '(31) 98888-7777',
    contactPreference: 'WhatsApp',
    notes: 'Ama coloracao quente e retoque com brilho intenso.',
    initials: 'JM',
    nextServiceName: 'Coloracao',
    nextContactDate: '2026-04-18',
    lastAppointmentLabel: 'Coloracao - 18/03/2026',
    history: [
      {
        id: 'history-3',
        serviceName: 'Coloracao',
        appointmentDate: '2026-03-18',
        messageStatus: 'Pendente',
        nextContactDate: '2026-04-18',
      },
    ],
  },
  {
    id: 'customer-3',
    name: 'Carla Souza',
    whatsapp: '(31) 97777-6666',
    contactPreference: 'Ligacao',
    notes: 'Prefere contato no fim da tarde.',
    initials: 'CS',
    nextServiceName: 'Escova',
    nextContactDate: '2026-04-19',
    lastAppointmentLabel: 'Escova - 19/03/2026',
    history: [
      {
        id: 'history-4',
        serviceName: 'Escova',
        appointmentDate: '2026-03-19',
        messageStatus: 'Pendente',
        nextContactDate: '2026-04-19',
      },
    ],
  },
];
