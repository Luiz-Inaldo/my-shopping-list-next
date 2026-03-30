import { z } from "zod";

export const userInfoFormSchema = z.object({
  username: z
    .string()
    .min(4, "O nome de usuário deve ter pelo menos 4 caracteres")
    .max(20, "O nome de usuário deve ter no máximo 20 caracteres")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'Somente letras e espaços são permitidos'),
});

export type IUserInfoForm = z.infer<typeof userInfoFormSchema>;
