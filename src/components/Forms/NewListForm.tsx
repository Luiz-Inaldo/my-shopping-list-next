"use client";
import ReactDOM from 'react-dom';
import React, { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { NewListProps } from '@/types/purchaseList'
import { sleep } from '@/functions/sleep'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Check, LoaderCircle, Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListSchema } from '@/zodSchema/createList';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { motion } from 'motion/react';
import { IPurchaseProps } from '@/types';
import { addPurchaseToDb } from '@/services/purchasesListServices';
import { invalidateAllQueries } from '@/functions/invalidadeQueries';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Timestamp } from 'firebase/firestore';
import useGeneralUserStore from '@/store/generalUserStore';

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


    const user = useGeneralUserStore(s => s.userProfile);
    const [isSettingPurchase, setPurchaseTransition] = useTransition();
    const isLocked = user ? !user?.emailVerified : false;

    const [open, setOpen] = useState(false);

    const form = useForm<NewListProps>({
        resolver: zodResolver(createListSchema)
    });


    const onSubmit = async (listData: NewListProps) => {

        const newList: IPurchaseProps = {
            title: listData.list_name,
            is_active: true,
            start_date: Timestamp.fromDate(new Date()),
            end_date: null,
            total_price: 0,
            purchase_items: [],
            max_value: parseFloat(listData.list_max_value.replace(',', '.')),
            user_id: user?.uid
        }

        setPurchaseTransition(async () => {
            await sleep(2);

            try {
                await addPurchaseToDb(newList);
                sendToastMessage({
                    title: "Lista criada com sucesso!",
                    type: "success"
                });
                if (user) {
                    invalidateAllQueries([[QUERY_KEYS.purchases, user?.uid]]);
                }
                // refetchPurchases();
            } catch (error) {
                console.error(error)
                sendToastMessage({
                    title: "Erro ao criar compra! Tente novamente.",
                    type: "error"
                })
            }

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
                    <Button disabled={isLocked} size="sm" className='fixed bottom-[80px] right-2.5 py-1.5 h-fit'>
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