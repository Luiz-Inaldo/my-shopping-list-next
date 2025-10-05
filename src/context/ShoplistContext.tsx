"use client";
import { IPurchaseProps, IShoplistContextProps, ISupabasePurchaseProps } from "@/types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { IProductProps } from "@/types";
import { IEditItemProps } from "@/types";
import useGeneralUserStore from "@/store/generalUserStore";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { usePathname, useSearchParams } from "next/navigation";
import { checkPurchaseItem, deletePurchaseItem, getProductsList, getProductsListItems, updatePurchaseItem } from "@/services/productsListServices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";

const ShoplistContext = createContext<IShoplistContextProps | undefined>(undefined);

export const ShoplistProvider = ({ children }: { children: React.ReactNode }) => {
    /**
     * =======>> store <<========
     */
    const userProfile = useGeneralUserStore(store => store.userProfile);
    const pathname = usePathname();

    const encodedListName = pathname.split("/")[2] || "";
    const listName = decodeURIComponent(encodedListName);


    /* ====> states <==== */
    const [auxData, setAuxData] = useState<IPurchaseProps | null>(null);
    const [filterValue, setFilterValue] = useState<string | null>(null);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [currentPurchase, setCurrentPurchase] = useState<ISupabasePurchaseProps | null>(null);

    // ===============
    // # ReactQuery
    // ===============
    const {
        data: productsList,
        isLoading: loadingProductsList,
        isFetching: fetchingProductsList,
        isPending: pendingProductsList,
        error: errorFetchingProducts,
        refetch: refetchProductsList,
    } = useQuery<IPurchaseProps | undefined>({
        queryKey: [QUERY_KEYS.productsList, listName],
        queryFn: fetchData,
        refetchOnWindowFocus: false,
        enabled: !!userProfile?.uid
    });
    const queryClient = useQueryClient();

    /**
     * ========>> refs <<========
     */
    const isFirstLoad = useRef<boolean>(true);

    /* ====> functions <==== */
    async function fetchData() {
        if (!userProfile) return;

        const res = await getProductsList(userProfile.uid, listName);
        const productsList = {
            purchase_items: [],
            ...res.data[0],
        };

        setAuxData(productsList as unknown as IPurchaseProps);
        return productsList as unknown as IPurchaseProps;

    }

    async function fetchListItemsData() {
        if (!productsList?.id) return;

        try {
            const res = await getProductsListItems(productsList.id);

            queryClient.setQueryData([QUERY_KEYS.productsList, userProfile?.uid, listName], (oldData: IPurchaseProps | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    purchase_items: res.data as unknown as IProductProps[],
                };
            });

            setAuxData((prevList) => ({
                ...prevList!,
                purchase_items: res.data as unknown as IProductProps[],
            }))
            if (isFirstLoad.current) isFirstLoad.current = false;
        } catch (error) {
            console.error(error);
            sendToastMessage({ title: "Houve um erro ao buscar os produtos.", type: 'error' });
        }

    }

    function calculateTotalValue() {

        const checkedItems = auxData?.purchase_items?.filter(product => product.checked === true) || [];
        const total = checkedItems.reduce((acc, item) => (
            acc += Number(item.value) * Number(item.quantity)
        ), 0);

        setTotalValue(total)

    }

    async function handleUpdateItem(object: IEditItemProps, itemID: string) {

        try {
            await updatePurchaseItem(productsList?.id as string, itemID, object);
            sendToastMessage({ title: "Produto atualizado com sucesso.", type: 'success' });
            queryClient.setQueryData(['productsList', userProfile?.uid, listName], (oldData: IPurchaseProps | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    purchase_items: oldData.purchase_items!.map(product => {
                        if (product.id === itemID) {
                            return {
                                ...product,
                                name: object.name,
                                quantity: object.quantity,
                                value: object.value,
                                unit_type: object.unit_type,
                            };
                        }
                        return product;
                    })
                };
            });
            setAuxData((oldData) => {
                return {
                    ...oldData!,
                    purchase_items: oldData!.purchase_items!.map(product => {
                        if (product.id === itemID) {
                            return {
                                ...product,
                                name: object.name,
                                quantity: object.quantity,
                                value: object.value,
                                unit_type: object.unit_type,
                            };
                        }
                        return product;
                    })
                };
            });
        } catch (error) {
            console.error(error);
            sendToastMessage({ title: "Houve um erro ao atualizar o produto.", type: 'error' });
        }

    }

    async function handleDeleteItem(itemID: string) {
        try {
            if (productsList?.purchase_items?.length === 1) {
                queryClient.setQueryData(['productsList', userProfile?.uid, listName], auxData);
                setFilterValue(null);
            }
            await deletePurchaseItem(productsList?.id as string, itemID);
            sendToastMessage({ title: "Produto removido com sucesso.", type: 'success' });
            queryClient.setQueryData(['productsList', userProfile?.uid, listName], (oldData: IPurchaseProps | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    purchase_items: oldData.purchase_items!.filter(product => product.id !== itemID)
                };
            });
            setAuxData(oldData => ({
                ...oldData!,
                purchase_items: oldData!.purchase_items!.filter(product => product.id !== itemID)
            }));
        } catch (error) {
            console.error(error);
            sendToastMessage({ title: "Houve um erro ao remover o produto.", type: 'error' });
        }
    }

    async function handleCheckItem(item: IProductProps, object?: IEditItemProps) {

        const editedItem = {
            ...item,
            value: object?.value ?? item.value,
            checked: !item.checked
        }

        try {

            await checkPurchaseItem(productsList?.id as string, item?.id as string, !item.checked);

            sendToastMessage({ title: `${item.name} marcado como adquirido.`, type: 'success' });
            queryClient.setQueryData(['productsList', userProfile?.uid, listName], ((oldList: IPurchaseProps | undefined) => {
                if (!oldList) return;

                return {
                    ...oldList!,
                    purchase_items: oldList!.purchase_items?.map(product => {
                        if (product.id === item.id) {
                            return editedItem;
                        }
                        return product;
                    })
                }
            }))
            setAuxData((oldList) => ({
                ...oldList!,
                purchase_items: oldList!.purchase_items?.map(product => {
                    if (product.id === item.id) {
                        return editedItem;
                    }
                    return product;
                })
            }))
        } catch (error) {
            sendToastMessage({ title: "Houve um erro ao marcar o item.", type: 'error' });
        }
    }

    async function handleDismarkItem(item: IProductProps) {

        const editedItem = {
            ...item,
            checked: !item.checked
        }

        try {

            await checkPurchaseItem(productsList?.id as string, item?.id as string, !item.checked);

            sendToastMessage({ title: `${item.name} desmarcado.`, type: 'success' });
            queryClient.setQueryData(['productsList', userProfile?.uid, listName], (oldList: IPurchaseProps | undefined) => {
                if (!oldList) return;

                return {
                    ...oldList!,
                    purchase_items: oldList!.purchase_items?.map(product => {
                        if (product.id === item.id) {
                            return editedItem;
                        }
                        return product;
                    })
                }
            })
            setAuxData((oldList) => ({
                ...oldList!,
                purchase_items: oldList!.purchase_items?.map(product => {
                    if (product.id === item.id) {
                        return editedItem;
                    }
                    return product;
                })
            }))
        } catch (error) {
            console.error(error)
            sendToastMessage({ title: "Houve um erro ao desmarcar o item.", type: 'error' });
        }

    }

    useEffect(() => {
        if (productsList && isFirstLoad.current) {
            fetchListItemsData();
        }

        if (productsList && !auxData) {
            setAuxData(productsList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsList]);

    useEffect(() => {
        if (productsList?.purchase_items && productsList.purchase_items.length > 0 && auxData) {
            calculateTotalValue();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsList?.purchase_items, auxData]);

    return (
        <ShoplistContext.Provider value={{
            listName,
            auxData,
            productsList,
            loadingProductsList,
            fetchingProductsList,
            pendingProductsList,
            errorFetchingProducts,
            filterValue,
            setFilterValue,
            totalValue,
            setTotalValue,
            currentPurchase,
            setCurrentPurchase,

            refetchProductsList,
            fetchListItemsData,
            handleUpdateItem,
            handleDeleteItem,
            handleCheckItem,
            handleDismarkItem
        }}>
            {children}
        </ShoplistContext.Provider>
    )
}

export function useShoplistContext() {
    const context = useContext(ShoplistContext);
    if (context === undefined) {
        throw new Error('useShoplistContext must be used within a ShoplistProvider');
    }
    return context as IShoplistContextProps;
}
