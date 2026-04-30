import { z } from 'zod';

export const messageTemplateSchema = z.object({
  templateText: z.string().min(10, 'Informe um texto base para a mensagem.'),
});

export const notificationSettingsSchema = z.object({
  isEnabled: z.boolean(),
  preferredTime: z.string().min(1, 'Informe o horario preferido.'),
  reminderMode: z.string().min(1, 'Selecione quando avisar.'),
});

export const salonProfileSchema = z.object({
  salonName: z.string().min(3, 'Informe o nome do salao.'),
  email: z.email('Informe um e-mail valido.'),
  phone: z.string().optional(),
});

export type MessageTemplateFormValues = z.infer<typeof messageTemplateSchema>;
export type NotificationSettingsFormValues = z.infer<typeof notificationSettingsSchema>;
export type SalonProfileFormValues = z.infer<typeof salonProfileSchema>;
