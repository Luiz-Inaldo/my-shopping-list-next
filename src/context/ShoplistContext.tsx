"use client";
import { IPurchaseProps, IShoplistContextProps, ISupabasePurchaseProps } from "@/types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { IProductProps } from "@/types";
import { IEditItemProps } from "@/types";
import useGeneralUserStore from "@/store/generalUserStore";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { useSearchParams } from "next/navigation";
import { TUiStates } from "@/types/uiStates";
import { checkPurchaseItem, deletePurchaseItem, getProductsList, getProductsListItems, updatePurchaseItem } from "@/services/productsListServices";

const ShoplistContext = createContext<IShoplistContextProps | undefined>(undefined);

export const ShoplistProvider = ({ children }: { children: React.ReactNode }) => {
    /**
     * =======>> store <<========
     */
    const userProfile = useGeneralUserStore(store => store.userProfile);

    const searchParams = useSearchParams();
    const listName = searchParams.get("name") || "";

    /* ====> states <==== */
    const [auxData, setAuxData] = useState<IPurchaseProps | null>(null);
    const [productsList, setProductsList] = useState<IPurchaseProps | null>(null);
    const [uiStates, setUiStates] = useState<TUiStates>({ isLoading: true, hasError: false });
    const [filterValue, setFilterValue] = useState<string | null>(null);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [currentPurchase, setCurrentPurchase] = useState<ISupabasePurchaseProps | null>(null);

    /**
     * ========>> refs <<========
     */
    const isFirstLoad = useRef<boolean>(true);

    /* ====> functions <==== */
    async function fetchData() {
        if (!userProfile) return;
        setUiStates(prev => ({ ...prev, isLoading: true }));

        try {
            const res = await getProductsList(userProfile.uid, listName);
            const productsList = {
                purchase_items: [],
                ...res.data[0],
            };

            setProductsList(productsList as unknown as IPurchaseProps);
            setAuxData(productsList as unknown as IPurchaseProps);

        } catch (error) {
            console.error(error);
            setUiStates(prev => ({ ...prev, hasError: true }));
        } finally {
            setUiStates(prev => ({ ...prev, isLoading: false }));
        }
    }

    async function fetchListItemsData() {
        if (!productsList) return;

        try {
            const res = await getProductsListItems(productsList.id!);

            setProductsList((prevList) => ({
                ...prevList!,
                purchase_items: res.data as unknown as IProductProps[],
            }));

            setAuxData((prevList) => ({
                ...prevList!,
                purchase_items: res.data as unknown as IProductProps[],
            }))
            if (isFirstLoad.current) isFirstLoad.current = false;
        } catch (error) {
            console.error(error);
            setUiStates(prev => ({ ...prev, hasError: true }));
        } finally {
            setUiStates(prev => ({ ...prev, isLoading: false }));
        }

    }

    function caculateTotalValue() {

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
            setProductsList((oldData) => {
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
            await deletePurchaseItem(productsList?.id as string, itemID);
            sendToastMessage({ title: "Produto removido com sucesso.", type: 'success' });
            setProductsList(oldData => ({
                ...oldData!,
                purchase_items: oldData!.purchase_items!.filter(product => product.id !== itemID)
            }));
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
            setProductsList((oldList) => ({
                ...oldList!,
                purchase_items: oldList!.purchase_items?.map(product => {
                    if (product.id === item.id) {
                        return editedItem;
                    }
                    return product;
                })
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
            setProductsList((oldList) => ({
                ...oldList!,
                purchase_items: oldList!.purchase_items?.map(product => {
                    if (product.id === item.id) {
                        return editedItem;
                    }
                    return product;
                })
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
            console.error(error)
            sendToastMessage({ title: "Houve um erro ao desmarcar o item.", type: 'error' });
        }

    }

    /* ====> effects <==== */
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProfile]);

    useEffect(() => {
        if (productsList && isFirstLoad.current) {
            fetchListItemsData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsList]);

    useEffect(() => {
        if (productsList?.purchase_items && productsList.purchase_items.length > 0) {
            caculateTotalValue();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsList?.purchase_items]);

    // useEffect(() => {
    //     caculateTotalValue();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [productsList]);

    // useEffect(() => {

    //     if (currentPurchase) {
    //         const parsedTotal = parseFloat(totalValue.replace(',', '.'));
    //         const parsedMaxValue = parseFloat(currentPurchase?.list_max_value.replace(',', '.'));

    //         if (parsedTotal < (parsedMaxValue * 0.8)) {
    //             setSituation('good');
    //         }

    //         if (parsedTotal >= (parsedMaxValue * 0.8) && parsedTotal < parsedMaxValue) {
    //             setSituation('normal');
    //         }

    //         if (parsedTotal >= parsedMaxValue) {
    //             setSituation('bad');
    //         }
    //     }

    // }, [totalValue, currentPurchase]);

    return (
        <ShoplistContext.Provider value={{
            listName,
            auxData,
            productsList,
            setProductsList,
            uiStates,
            filterValue,
            setFilterValue,
            totalValue,
            setTotalValue,
            currentPurchase,
            setCurrentPurchase,

            fetchData,
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
