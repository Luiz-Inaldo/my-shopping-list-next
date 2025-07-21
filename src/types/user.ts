import z from "zod";
import { loginFormSchema, registerFormSchema } from "./zodTypes";

export type User = z.infer<typeof loginFormSchema>;

export type RegisterProps = z.infer<typeof registerFormSchema>;