import { CATEGORIES } from "@/constants/categories";
import { UNIT_TYPES } from "@/data/unitTypes";
import z from "zod";

const valueStringSchema = z.union([
  z.string().transform((val) => {
    if (val === "" || val === null || val === undefined) return 0;
    
    // Remove tudo exceto números, vírgula e ponto
    const cleaned = val.replace(/[^\d,.]/g, "");
    
    const num = Number(cleaned.replace(",", "."));
    return isNaN(num) ? 0 : num;
  }),
  z.number()
]).optional();

export const addPurchaseProductSchema = z.object({
  name: z.string({ message: "Campo obrigatório" }).min(1, { message: "Campo obrigatório" }),
  category: z.enum(CATEGORIES.map(category => category.name) as [string, ...string[]], {
    required_error: "Campo obrigatório"
  }).optional(),
  unit_type: z.enum(UNIT_TYPES.map(type => type) as [string, ...string[]], {
    required_error: "Campo obrigatório"
  }).optional(),
  quantity: valueStringSchema,
  value: valueStringSchema,
  checked: z.boolean().optional().default(false),
}).refine((data) => data.category !== undefined, {
  message: "Campo obrigatório",
  path: ["category"]
}).refine((data) => data.unit_type !== undefined, {
  message: "Campo obrigatório",
  path: ["unit_type"]
});

export type AddPurchaseProductInput = z.input<typeof addPurchaseProductSchema>;
export type AddPurchaseProductType = z.infer<typeof addPurchaseProductSchema>;
