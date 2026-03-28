import { Timestamp } from "firebase/firestore";

export type Filters = {
    id: string;
    operator: "==" | "!=" | ">" | "<" | ">=" | "<=" | "array-contains" | "array-contains-any" | "in" | "not-in";
    value: string | number | boolean | string[] | number[] | boolean[] | null | Timestamp;
}