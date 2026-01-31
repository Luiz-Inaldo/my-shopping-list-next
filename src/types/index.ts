import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { UnitTypes } from "@/enums/unitTypes";

export type ModalStateProps = "OPEN" | "CLOSED";
export type ModalTypeProps =
  | null
  | "LIMIT_VALUE"
  | "DELETE_PRODUCT"
  | "EDIT_PRODUCT"
  | "CHECK_PRODUCT"
  | "DELETE_PURCHASE";
export interface IShoplistContextProps {
  auxData: IPurchaseProps | null;
  productsList: IPurchaseProps | undefined;
  filterValue: string | null;
  setFilterValue: React.Dispatch<React.SetStateAction<string | null>>;
  totalValue: number;
  setTotalValue: React.Dispatch<React.SetStateAction<number>>;
  currentPurchase: ISupabasePurchaseProps | null;
  setCurrentPurchase: React.Dispatch<
    React.SetStateAction<ISupabasePurchaseProps | null>
  >;

  loadingProductsList: boolean;
  fetchingProductsList: boolean;
  pendingProductsList: boolean;
  errorFetchingProducts: unknown;

  refetchProductsList: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<IPurchaseProps | undefined, Error>>;
  handleUpdateItem: (object: IEditItemProps, itemID: string) => Promise<void>;
  handleDeleteItem: (itemID: string) => Promise<void>;
  handleCheckItem: (
    item: IProductProps,
    object?: IEditItemProps
  ) => Promise<void>;
  handleDismarkItem: (item: IProductProps) => Promise<void>;
}

export interface IPuchasesContextProps {
  // states
  purchasesList: IPurchaseProps[] | undefined;
  loadingPurchasesList?: boolean;
  fetchingPurchasesList?: boolean;
  pendingPurchasesList?: boolean;
  errorFetchingPurchases?: unknown;
  // uiStates: TUiStates;

  // functions
  // setPurchasesList: React.Dispatch<React.SetStateAction<IPurchaseProps[]>>;
  // filterPurchases: (filter: IFilterProps) => void;
  deletePurchase: (purchaseId: string) => Promise<void>;
  // refetchPurchases: () => void
}

export interface IFormItem extends Omit<IProductProps, "id"> { }

export interface IEditItemProps
  extends Omit<IProductProps, "category" | "checked"> { }


export interface IProductProps {
  id?: string;
  name: string;
  category: string;
  quantity: number | string;
  value: number | string;
  checked: boolean;
  unit_type: UnitTypes;
}

export interface IPurchaseProps {
  id?: string;
  title: string;
  is_active: boolean;
  max_value: number;
  start_date: Timestamp | null;
  end_date: Timestamp | null;
  purchase_items?: never[] | IProductProps[];
  total_price: number;
  user_id: string | undefined;
}

export type TMonthlyStatisticsResponse = Array<Omit<IPurchaseProps, "start_date" | "end_date"> & {
  start_date: string | null;
  end_date: string | null;
}>;

export type TMonthlyStatisticsData = {
  currentMonthSpending: number;
  currentMonthListsCount: number;
  currentMonthItemsCount: number;
  spendingDifference: number;
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
