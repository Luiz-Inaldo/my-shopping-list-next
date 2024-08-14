import { IProductProps } from "./product";
import { supabase } from "@/lib/api";

export interface IProductsContextProps {
    data: IProductProps[];
    setData: React.Dispatch<React.SetStateAction<IProductProps[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchData: () => Promise<void>;
    formatNumber: (value: string, quantity: number) => string;
}