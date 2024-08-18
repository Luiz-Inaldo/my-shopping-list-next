import { IEditItemProps } from "./editItem";
import { IProductProps } from "./product";

export interface IProductsContextProps {
    data: IProductProps[];
    setData: React.Dispatch<React.SetStateAction<IProductProps[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    modal: {
        state: string;
        type:string;
    }
    setModal: React.Dispatch<React.SetStateAction<{
        state: string;
        type:string;
    }>>;
    optionMenu: number | null;
    setOptionMenu: React.Dispatch<React.SetStateAction<number | null>>;
    totalValue: string;
    setTotalValue: React.Dispatch<React.SetStateAction<string>>;
    stipulatedValue: string;
    setStipulatedValue: React.Dispatch<React.SetStateAction<string>>;
    situation: string;
    setSituation: React.Dispatch<React.SetStateAction<string>>;

    fetchData: () => Promise<void>;
    formatNumber: (value: string, quantity: number) => string;
    deleteAllItems: () => Promise<void>;
    handleUpdateItem: (object: IEditItemProps, itemID: number) => Promise<void>;
    handleDeleteItem: (itemID: number) => Promise<void>;
    handleCheckItem:(item: IProductProps, object?: IEditItemProps) => Promise<void>;
    handleDismarkItem: (item: IProductProps) => Promise<void>;
}