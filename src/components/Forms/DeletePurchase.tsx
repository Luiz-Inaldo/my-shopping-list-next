import { ProductsContext } from '@/context/ProductsContext';
import { IProductProps, IPurchaseProps } from '@/types';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from '../ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { supabase } from '@/lib/api';
import { PurchasesContext } from '@/context/PurchasesContext';
import { Button } from '../ui/button';

export const DeletePurchase = ({ purchase }: { purchase: IPurchaseProps | undefined }) => {

    const { modal, setModal } = useContext(ProductsContext);
    const { purchasesList, setPurchasesList } = useContext(PurchasesContext);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isFading, setIsFading] = useState<boolean>(false);

    async function deletePurchase(purchase: IPurchaseProps | undefined) {

        if  (!purchase) return;

        const { error } = await supabase.from("purchases").delete().eq("id", purchase.id);

        if (error) {
            toast({
                description: "Não foi possível excluir essa compra.",
                action: <ToastAction altText="Ok">Ok</ToastAction>
            });
        } else {
            toast({
                description: "Compra excluída com sucesso.",
                action: <ToastAction altText="Ok">Ok</ToastAction>
            });
            setPurchasesList(purchasesList?.filter(item => item.id !== purchase.id))

        }

        setModal({
            state: "CLOSED",
            type: null
        })

    }

    useEffect(() => {
        if (modal.type === 'DELETE_PURCHASE') {
            setIsVisible(true);
            const timer = setTimeout(() => { setIsFading(true) }, 100);
            return () => clearTimeout(timer);
        } else {
            setIsFading(false);
            const timer = setTimeout(() => setIsVisible(false), 500);
            return () => clearTimeout(timer);
        }
    }, [modal])

    return (
        <React.Fragment>
            {isVisible && (
                <div className={`${isFading ? 'opacity-100 visible' : 'opacity-0 invisible'} w-[350px] rounded bg-app-container p-5 transition-all duration-500`}>
                    <h2 className='text-center text-subtitle'>Deseja realmente deletar a compra do histórico?</h2>
                    <div className='flex gap-2 mt-5'>
                        <Button
                            type='button'
                            onClick={() => deletePurchase(purchase)}
                            className='col-span-1 w-full rounded-full'>
                            Sim
                        </Button>
                        <Button
                            type='button'
                            onClick={() => setModal({
                                state: 'CLOSED',
                                type: null
                            })}
                            variant="outline"
                            className='col-span-1 w-full rounded-full'>
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}
