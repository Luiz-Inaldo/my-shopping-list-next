"use client";
import ReactDOM from 'react-dom';
import { Dialog } from '@radix-ui/react-dialog'
import React, { useContext, useState, useTransition } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { NewListProps } from '@/types/purchaseList'
import { sleep } from '@/functions/sleep'
import { supabase } from '@/lib/api'
import useGeneralUserStore from '@/store/generalUserStore'
import { ProductsContext } from '@/context/ProductsContext'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Check, LoaderCircle, Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListSchema } from '@/types/zodTypes';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { motion } from 'motion/react';

const addButtonVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1
    },
    transition: {
        duration: 0.5,
        delay: 1
    }
} as const;

const NewListForm = () => {

    const user = useGeneralUserStore(store => store.user);
    const [isSettingPurchase, setPurchaseTransition] = useTransition();

    const [open, setOpen] = useState(false);

    const form = useForm<NewListProps>({
        resolver: zodResolver(createListSchema)
    });


    const onSubmit = async (listData: NewListProps) => {
        setPurchaseTransition(async () => {
            await sleep(2);

            const { error } = await supabase.from("purchases").insert([{
                title: listData.list_name,
                purchase_items: JSON.stringify([]),
                items_count: 0,
                purchase_date: new Date(),
                total_price: "0,00",
                max_value: parseFloat(listData.list_max_value.replace(',', '.')),
                user_id: user?.id
            }]);

            if (error) {
                console.error(error);
            }

            // fetchPurchaseData();
            sendToastMessage({
                title: "Lista criada com sucesso!",
                type: "success"
            });
            setOpen(false);
        })
    }

    return ReactDOM.createPortal(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <motion.div
                    variants={addButtonVariants}
                    initial="initial"
                    animate="animate"
                    transition={addButtonVariants.transition}
                >
                    <Button size="sm" className='fixed bottom-[80px] right-2.5 py-1.5 h-fit'>
                        <Plus size={16} />
                        <span>Nova lista</span>
                    </Button>
                </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-[400px]" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle className="text-center text-subtitle font-semibold">
                        Preencha as informações da nova lista
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription hidden />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='w-full grid place-items-center mt-5 px-3 space-y-5'>

                        <div
                            className={`flex flex-col gap-3 w-full`}
                        >

                            <FormField
                                control={form.control}
                                name="list_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da lista</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Insira o nome" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="list_max_value"
                                render={({ field }) => (
                                    <FormItem className='space-y-2'>
                                        <FormLabel>Valor máximo da lista</FormLabel>
                                        <FormDescription className='text-paragraph text-xs italic !m-0'>Exemplo: 100 ou 100,00</FormDescription>
                                        <FormControl>
                                            <Input placeholder="Insira o valor máximo" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className='w-full cursor-pointer shadow-md'
                            disabled={isSettingPurchase}
                        >
                            {isSettingPurchase ? (
                                <>
                                    <LoaderCircle className='animate-spin' size={20} />
                                    <span>Criando lista...</span>
                                </>
                            ) : (
                                <>
                                    <Check size={20} />
                                    <span>Vamos começar</span>
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent >
        </Dialog >, document.body
    )
}

export default NewListForm