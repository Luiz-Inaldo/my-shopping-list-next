import * as z from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string({ message: 'Campo obrigatório.' })
    .email({ message: 'Insira um formato de e-mail inválido.' }),
  password: z
    .string({ message: 'Campo obrigatório.' })
    .min(6, { message: 'O campo senha deve conter no mínimo 6 caracteres.' }),
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;

