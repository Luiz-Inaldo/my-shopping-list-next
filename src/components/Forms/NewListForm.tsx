"use client";
import { Dialog } from '@radix-ui/react-dialog'
import React, { useContext, useTransition } from 'react'
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
import { Check, LoaderCircle } from 'lucide-react';

const NewListForm = ({ children }: { children: React.ReactNode }) => {

    const user = useGeneralUserStore(store => store.user);
    const [isSettingPurchase, setPurchaseTransition] = useTransition();
    const { fetchPurchaseData } = useContext(ProductsContext);

    const form = useForm<NewListProps>();

    const canCreateList = form.watch("list_name") && form.watch("list_max_value");

    const onSubmit = async (listData: NewListProps) => {
        setPurchaseTransition(async () => {
            await sleep(2);

            const { error } = await supabase.from("active_purchases").insert([{
                list_name: listData.list_name,
                list_max_value: listData.list_max_value,
                user_id: user?.id
            }]);

            if (error) {
                console.error(error);
            }

            fetchPurchaseData();
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
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
                            disabled={isSettingPurchase || !canCreateList}
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
        </Dialog >
    )
}

export default NewListForm