import * as z from 'zod';

export const deleteAccountSchema = z.object({
  password: z.string().optional(),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

