import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Informe um e-mail valido.'),
  password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres.'),
});

export const signUpSchema = z
  .object({
    ownerName: z.string().min(3, 'Informe o nome da responsavel.'),
    salonName: z.string().min(3, 'Informe o nome do salao.'),
    salonPhone: z.string().optional(),
    email: z.email('Informe um e-mail valido.'),
    password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres.'),
    confirmPassword: z.string().min(8, 'Confirme a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
