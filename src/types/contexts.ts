import { IEditItemProps } from "./editItem";
import { IProductProps } from "./product";

export interface IProductsContextProps {
    data: IProductProps[];
    setData: React.Dispatch<React.SetStateAction<IProductProps[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    optionMenu: number | null;
    setOptionMenu: React.Dispatch<React.SetStateAction<number | null>>;
    editFormOpen: boolean;
    setEditFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchData: () => Promise<void>;
    formatNumber: (value: string, quantity: number) => string;
    handleUpdateItem: (object: IEditItemProps, itemID: number) => Promise<void>;
    handleDeleteItem: (itemID: number) => Promise<void>;
}