import * as z from 'zod';

export const deleteAccountSchema = z.object({
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

