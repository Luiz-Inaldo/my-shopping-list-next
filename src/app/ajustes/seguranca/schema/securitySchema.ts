import { z } from "zod";

export const securitySchema = z.object({
  newPassword: z.string()
    .min(8, { message: "O campo senha deve conter no mínimo 8 caracteres." })
    .max(30, { message: "O campo senha deve conter no máximo 30 caracteres." })
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial"),
  confirmPassword: z.string()
    .min(8, { message: "O campo senha deve conter no mínimo 8 caracteres." })
    .max(30, { message: "O campo senha deve conter no máximo 30 caracteres." }),
  password: z.string().optional(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type SecurityFormData = z.infer<typeof securitySchema>;
