import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(3, 'Informe o nome da cliente.'),
  whatsapp: z.string().min(8, 'Informe um WhatsApp valido.'),
  birthDate: z.string().optional(),
  contactPreference: z.enum(['WhatsApp', 'Ligacao', 'SMS']),
  notes: z.string().optional(),
  photoUrl: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
