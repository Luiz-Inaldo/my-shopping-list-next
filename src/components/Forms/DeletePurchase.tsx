import { IPurchaseProps } from '@/types';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Trash2 } from 'lucide-react';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { deletePurchaseFromDb } from '@/services/purchasesListServices';

export const DeletePurchase = ({ purchase, trigger }: { purchase: IPurchaseProps, trigger?: React.ReactNode }) => {

    const [open, setOpen] = useState(false);

    async function handleDeletePurchase(purchaseId: string) {
        try {
            await deletePurchaseFromDb(purchaseId);
            sendToastMessage({ title: "Compra deletada com sucesso!", type: "success" });

        } catch (error) {
            console.error(error);
            sendToastMessage({ title: "Erro ao deletar compra!", type: "error" });
        }
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <div className="flex items-center justify-center size-8 rounded-full bg-red-500 dark:bg-red-400 cursor-pointer text-snow">
                        <Trash2 size={16} />
                    </div>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-[400px]" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle className="text-center text-subtitle font-semibold">
                        Deletar lista
                    </DialogTitle>
                    <DialogDescription>
                        {`Deseja realmente deletar a lista ${purchase.title}?`}
                    </DialogDescription>
                </DialogHeader>
                <DialogDescription hidden />
                <div className='flex gap-2 mt-5'>
                    <Button
                        type='button'
                        onClick={() => handleDeletePurchase(purchase.id as string)}
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
