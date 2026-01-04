import * as z from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Insira um e-mail válido' }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

