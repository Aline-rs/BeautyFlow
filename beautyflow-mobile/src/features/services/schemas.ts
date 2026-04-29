import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(2, 'Informe o nome do servico.'),
  suggestedReturnDays: z
    .string()
    .min(1, 'Informe o prazo sugerido.')
    .refine((value) => Number(value) > 0, 'O prazo deve ser maior que zero.'),
  isActive: z.boolean(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
