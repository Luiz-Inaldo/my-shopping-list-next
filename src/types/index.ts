export type ModalStateProps = "OPEN" | "CLOSED";
export type ModalTypeProps = null | 'LIMIT_VALUE' | 'DELETE_PRODUCT' | 'EDIT_PRODUCT' | 'CHECK_PRODUCT' | 'DELETE_PURCHASE'
export interface IProductsContextProps {
    // user: any,
    // setUser: React.Dispatch<React.SetStateAction<any>>;
    data: IProductProps[] | null;
    setData: React.Dispatch<React.SetStateAction<IProductProps[] | null>>;
    loadingProducts: boolean;
    modal: {
        state: ModalStateProps,
        type: ModalTypeProps
    }
    setModal: React.Dispatch<React.SetStateAction<{
        state: ModalStateProps;
        type: ModalTypeProps;
    }>>;
    optionMenu: string | null;
    setOptionMenu: React.Dispatch<React.SetStateAction<string | null>>;
    totalValue: string;
    setTotalValue: React.Dispatch<React.SetStateAction<string>>;
    situation: string;
    setSituation: React.Dispatch<React.SetStateAction<string>>;
    currentPurchase: ISupabasePurchaseProps | null;
    setCurrentPurchase: React.Dispatch<React.SetStateAction<ISupabasePurchaseProps | null>>;

    fetchData: () => Promise<void>;
    fetchPurchaseData: () => Promise<void>;
    deleteCurrentPurchase: () => Promise<void>;
    deleteAllItems: () => Promise<void>;
    handleUpdateItem: (object: IEditItemProps, itemID: string) => Promise<void>;
    handleDeleteItem: (itemID: string) => Promise<void>;
    handleCheckItem:(item: IProductProps, object?: IEditItemProps) => Promise<void>;
    handleDismarkItem: (item: IProductProps) => Promise<void>;
}

export interface IPuchasesContextProps {
    purchasesList: IPurchaseProps[];
    setPurchasesList: React.Dispatch<React.SetStateAction<IPurchaseProps[]>>;
    purchasesLoading: boolean;
    filterPurchases: (filter: IFilterProps) => void;
}

export interface IFormItem extends Omit<IProductProps, 'id'> {}

export interface IEditItemProps extends Omit<IProductProps, 'category' | 'checked'> {}

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
    purchase_date: any;
    purchase_items: string;
    total_price: string;
    user_id: string | undefined;
}

export interface ISupabasePurchaseProps {
    id: string;
    list_name: string;
    list_max_value: string;
    user_id: string;
}

export interface IFilterProps {
    month: string | number;
    year: string | number;
}
