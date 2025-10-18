import * as z from "zod";

export const loginFormSchema = z.object({
  email: z
    .string({ message: "Campo obrigatório." })
    .email({ message: "Insira um formato de e-mail inválido." }),
  password: z
    .string({ message: "Campo obrigatório." })
    .min(6, { message: "O campo senha deve conter no mínimo 6 caracteres." }),
});

export const registerFormSchema = z.object({
  email: z
    .string({ message: "Campo obrigatório." })
    .email({ message: "Insira um formato de e-mail inválido." }),
  password: z
    .string({ message: "Campo obrigatório." })
    .min(8, { message: "O campo senha deve conter no mínimo 8 caracteres." })
    .max(30, { message: "O campo senha deve conter no máximo 30 caracteres." })
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial"),
  username: z
    .string({ message: "Campo obrigatório." })
    .min(4, { message: "Nome de usuário deve conter no mínimo 4 caracteres." })
    .max(20, { message: "Nome de usuário deve conter no máximo 20 caracteres." })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'Somente letras e espaços são permitidos'),
  confirm_password: z.string({ message: "Campo obrigatório." }).max(30, { message: "O campo senha deve conter no máximo 30 caracteres." }),
}).refine((data) => data.password === data.confirm_password, {
  message: "As senhas devem ser iguais.",
  path: ["confirm_password"],
});

export const createListSchema = z.object({
  list_name: z.string({ message: "Campo obrigatório." }),
  list_max_value: z.string({message: "Campo obrigatório."}).regex(/^[0-9,]+$/, 'Somente números e vírgulas são permitidos')
});

export const createProductListItemSchema = z.object({
  name: z.string({ message: "Campo obrigatório." }).min(6, { message: "O campo nome deve conter no mínimo 6 caracteres." }).max(40, { message: "O campo nome deve conter no máximo 40 caracteres." }),
  category: z.string({message: "Campo obrigatório"}),
  quantity: z.number({message: "Campo obrigatório"}),
  value: z.number(),
  checked: z.boolean(),
  unit_type: z.string({message: "Campo obrigatório"})
})