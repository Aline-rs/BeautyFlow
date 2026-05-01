import { z } from 'zod';

export const appointmentSchema = z.object({
  customerId: z.string().min(1, 'Selecione uma cliente.'),
  serviceIds: z.array(z.string()).min(1, 'Selecione pelo menos um servico.'),
  appointmentDate: z.string().min(1, 'Informe a data do atendimento.'),
  notes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
