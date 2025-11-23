"use client";
import { IPurchaseProps, IShoplistContextProps, ISupabasePurchaseProps } from "@/types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { IProductProps } from "@/types";
import { IEditItemProps } from "@/types";
import useGeneralUserStore from "@/store/generalUserStore";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { usePathname } from "next/navigation";
import { getProductsList, updatePurchase } from "@/services/productsListServices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { queryClient } from "@/utils/queryClient";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ShoplistContext = createContext<IShoplistContextProps | undefined>(undefined);

export const ShoplistProvider = ({ children }: { children: React.ReactNode }) => {
    /**
     * =======>> store <<========
     */
    const userProfile = useGeneralUserStore(store => store.userProfile);
    const pathname = usePathname();

    const listId = pathname.split("/")[2] || "";

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
        queryKey: [QUERY_KEYS.productsList, listId],
        queryFn: fetchData,
        refetchOnWindowFocus: false,
        enabled: !!userProfile?.uid
    });

    /* ====> functions <==== */
    async function fetchData() {
        if (!userProfile) return;

        const res = await getProductsList(listId);

        setAuxData(res?.data as unknown as IPurchaseProps);

        // verifica se há filtro ativo antes de popular os dados da lista
        if (filterValue) {
            const filteredList = res?.data?.purchase_items?.
            filter(product => product.category.toLowerCase().includes(filterValue.toLowerCase()) || product.name.toLowerCase().includes(filterValue.toLowerCase())) ?? [];

            if (filteredList.length === 0) {
                setFilterValue(null);
            }
            
            return {
                ...res?.data!,
                purchase_items: filteredList.length > 0 ? filteredList : res?.data?.purchase_items
            } as unknown as IPurchaseProps;
        }

        return res?.data as unknown as IPurchaseProps;

    }

    function calculateTotalValue() {

        const checkedItems = auxData?.purchase_items?.filter(product => product.checked === true) || [];
        const total = checkedItems.reduce((acc, item) => (
            acc += Number(item.value) * Number(item.quantity)
        ), 0);

        setTotalValue(total)

    }

    async function handleUpdateItem(object: IEditItemProps, itemID: string) {

        const updatedProducts = auxData?.purchase_items?.map(product => {
            if (product.id === itemID) {
                return {
                    ...product,
                    ...object
                };
            }
            return product;
        }) as IProductProps[];

        try {
            await updatePurchase(productsList?.id as string, updatedProducts);
            sendToastMessage({ title: "Produto atualizado com sucesso.", type: 'success' });
            
        } catch (error) {
            console.error(error);
            sendToastMessage({ title: "Houve um erro ao atualizar o produto.", type: 'error' });
        }

    }

    async function handleDeleteItem(itemID: string) {

        const updatedGeneralProducts = auxData?.purchase_items?.filter(product => product.id !== itemID) as IProductProps[];

        try {

            await updatePurchase(productsList?.id as string, updatedGeneralProducts);
            sendToastMessage({ title: "Produto removido com sucesso.", type: 'success' });
            
        } catch (error) {
            console.error(error);
            sendToastMessage({ title: "Houve um erro ao remover o produto.", type: 'error' });
        }
    }

    async function handleCheckItem(item: IProductProps, object?: IEditItemProps) {

        const updatedProducts = productsList?.purchase_items?.map(product => {
            if (product.id === item.id) {
                return {
                    ...item,
                    value: object?.value ?? item.value,
                    checked: !item.checked
                };
            }
            return product;
        }) as IProductProps[];

        try {

            await updatePurchase(productsList?.id as string, updatedProducts);

            sendToastMessage({ title: `${item.name} marcado como adquirido.`, type: 'success' });
            
        } catch (error) {
            sendToastMessage({ title: "Houve um erro ao marcar o item.", type: 'error' });
        }
    }

    async function handleDismarkItem(item: IProductProps) { 

        const updatedProducts = productsList?.purchase_items?.map(product => {
            if (product.id === item.id) {
                return {
                    ...item,
                    checked: !item.checked
                };
            }
            return product;
        }) as IProductProps[];

        try {

            await updatePurchase(productsList?.id as string, updatedProducts);

            sendToastMessage({ title: `${item.name} desmarcado.`, type: 'success' });
        } catch (error) {
            console.error(error)
            sendToastMessage({ title: "Houve um erro ao desmarcar o item.", type: 'error' });
        }

    }

    useEffect(() => {
        const productsListRef = doc(db, 'purchases', listId);
        const unsubscribe = onSnapshot(productsListRef, (snapshot) => {
            const data = snapshot.data() as IPurchaseProps;
            if (data.is_active) {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.productsList, listId]
                });
            }
        });
        return () => unsubscribe();
    }, [listId]);

    useEffect(() => {
        if (productsList && !auxData) {
            setAuxData(productsList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsList]);

    useEffect(() => {
        if (productsList?.purchase_items && auxData) {
            calculateTotalValue();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsList?.purchase_items, auxData]);

    return (
        <ShoplistContext.Provider value={{
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
