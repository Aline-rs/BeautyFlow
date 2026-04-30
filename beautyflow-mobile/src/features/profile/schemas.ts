import { z } from 'zod';

export const professionalProfileSchema = z.object({
  name: z.string().min(3, 'Informe seu nome.'),
  email: z.email('Informe um e-mail valido.'),
});

export type ProfessionalProfileFormValues = z.infer<typeof professionalProfileSchema>;
