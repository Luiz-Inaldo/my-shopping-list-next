export interface IProductsContextProps {
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>;
    data: IProductProps[];
    setData: React.Dispatch<React.SetStateAction<IProductProps[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    modal: {
        state: string;
        type: ''
        | 'LIMIT_VALUE'
        | 'DELETE_PRODUCT'
        | 'EDIT_PRODUCT'
        | 'CHECK_PRODUCT';
    }
    setModal: React.Dispatch<React.SetStateAction<{
        state: string;
        type:string;
    }>>;
    optionMenu: string | null;
    setOptionMenu: React.Dispatch<React.SetStateAction<string | null>>;
    totalValue: string;
    setTotalValue: React.Dispatch<React.SetStateAction<string>>;
    stipulatedValue: string;
    setStipulatedValue: React.Dispatch<React.SetStateAction<string>>;
    situation: string;
    setSituation: React.Dispatch<React.SetStateAction<string>>;

    fetchData: () => Promise<void>;
    deleteAllItems: () => Promise<void>;
    handleUpdateItem: (object: IEditItemProps, itemID: string) => Promise<void>;
    handleDeleteItem: (itemID: string) => Promise<void>;
    handleCheckItem:(item: IProductProps, object?: IEditItemProps) => Promise<void>;
    handleDismarkItem: (item: IProductProps) => Promise<void>;
}

export interface IFormItem extends Omit<IProductProps, 'id' | 'value'> {}

export interface IEditItemProps extends Omit<IProductProps, 'id' | 'category' | 'checked'> {}

export interface IProductProps {
    id: string;
    name: string;
    category: string;
    quantity: number;
    value: string;
    checked: boolean;
}

export interface IPurchaseProps {
    id?: string;
    title: string;
    purchase_date: string;
    purchase_items: string;
    total_price: string;
    user_id: string;
}
