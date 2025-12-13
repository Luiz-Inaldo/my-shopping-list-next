import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;


