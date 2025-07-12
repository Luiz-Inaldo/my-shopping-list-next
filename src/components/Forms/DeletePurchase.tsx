import { ProductsContext } from '@/context/ProductsContext';
import { IProductProps, IPurchaseProps } from '@/types';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from '../ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { supabase } from '@/lib/api';
import { PurchasesContext } from '@/context/PurchasesContext';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Trash2 } from 'lucide-react';

export const DeletePurchase = ({ purchase }: { purchase: IPurchaseProps | undefined }) => {

    const { purchasesList, setPurchasesList } = useContext(PurchasesContext);
    const [open, setOpen] = useState(false);

    async function deletePurchase(purchase: IPurchaseProps | undefined) {

        if (!purchase) return;

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

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-center cursor-pointer text-red-400 dark:text-red-500">
                    <Trash2 size={16} />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[400px]" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle className="text-center text-subtitle font-semibold">
                        Deseja realmente deletar a compra do histórico?
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription hidden />
                <div className='flex gap-2 mt-5'>
                    <Button
                        type='button'
                        onClick={() => deletePurchase(purchase)}
                        className='col-span-1 w-full rounded-full'>
                        Sim
                    </Button>
                    <Button
                        type='button'
                        onClick={() => setOpen(false)}
                        variant="outline"
                        className='col-span-1 w-full rounded-full'>
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
