import * as z from 'zod';

export const createListSchema = z.object({
  list_name: z.string({ message: 'Campo obrigatório.' }),
  list_max_value: z.string({ message: 'Campo obrigatório.' }).regex(/^[0-9,]+$/, 'Somente números e vírgulas são permitidos'),
});

export type CreateListInput = z.infer<typeof createListSchema>;

