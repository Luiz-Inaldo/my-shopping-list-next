import z from "zod";
import { createListSchema } from "./zodTypes";

export type NewListProps = z.infer<typeof createListSchema>;