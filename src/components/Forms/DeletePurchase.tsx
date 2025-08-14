import { IPurchaseProps } from '@/types';
import React, { useState } from 'react'
import { toast } from '../ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { supabase } from '@/lib/api';
import { usePurchasesContext } from '@/context/PurchasesContext';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Trash2 } from 'lucide-react';

export const DeletePurchase = ({ purchase }: { purchase: IPurchaseProps }) => {

    const { deletePurchase } = usePurchasesContext();
    const [open, setOpen] = useState(false);

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
                        onClick={() => deletePurchase(purchase.id as string)}
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
