import { TUiStates } from "./uiStates";

export type ModalStateProps = "OPEN" | "CLOSED";
export type ModalTypeProps = null | 'LIMIT_VALUE' | 'DELETE_PRODUCT' | 'EDIT_PRODUCT' | 'CHECK_PRODUCT' | 'DELETE_PURCHASE'
export interface IShoplistContextProps {
    listName: string;
    auxData: IPurchaseProps | null;
    productsList: IPurchaseProps | null;
    setProductsList: React.Dispatch<React.SetStateAction<IPurchaseProps | null>>;
    uiStates: TUiStates;
    filterValue: string | null;
    setFilterValue: React.Dispatch<React.SetStateAction<string | null>>;
    totalValue: number;
    setTotalValue: React.Dispatch<React.SetStateAction<number>>;
    currentPurchase: ISupabasePurchaseProps | null;
    setCurrentPurchase: React.Dispatch<React.SetStateAction<ISupabasePurchaseProps | null>>;

    fetchData: () => Promise<void>;
    fetchListItemsData: () => Promise<void>;
    handleUpdateItem: (object: IEditItemProps, itemID: string) => Promise<void>;
    handleDeleteItem: (itemID: string) => Promise<void>;
    handleCheckItem:(item: IProductProps, object?: IEditItemProps) => Promise<void>;
    handleDismarkItem: (item: IProductProps) => Promise<void>;
}

export interface IPuchasesContextProps {
    // states
    purchasesList: IPurchaseProps[];
    uiStates: TUiStates;

    // functions
    setPurchasesList: React.Dispatch<React.SetStateAction<IPurchaseProps[]>>;
    filterPurchases: (filter: IFilterProps) => void;
    deletePurchase:(purchaseId: string) => Promise<void>;
    refetchPurchases: () => void
}

export interface IFormItem extends Omit<IProductProps, 'id'> {}

export interface IEditItemProps extends Omit<IProductProps, 'category' | 'checked'> {}

type TProductsUnitTypes = 'und' | 'kg' | 'lt' | 'cx' | 'fd' | 'pct';

export interface IProductProps {
    id?: string;
    name: string;
    category: string;
    quantity: number | string;
    value: number | string;
    checked: boolean;
    unit_type: TProductsUnitTypes;
}

export interface IPurchaseProps {
    id?: string; //TODO: Supabase case use. remove later
    title: string;
    is_active: boolean;
    max_value: number;
    items_count: number;
    start_date: any;
    end_date: any;
    purchase_items?: never[] | IProductProps[];
    total_price: number;
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
