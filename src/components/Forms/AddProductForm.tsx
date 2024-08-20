"use client";
import React, { useContext, useEffect, useState } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { IFormItem } from '@/types/formItem'
import { ShadSelect } from '../Select'
import { SelectItem } from '../ui/select'
import { CATEGORIES } from '@/constants/constants'
import { supabase } from '@/lib/api'
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from '../ui/toast'
import { ProductsContext } from '@/context/ProductsContext';

export const AddProductForm = () => {

    const { toast } = useToast();
    const { user, fetchData } = useContext(ProductsContext);
    const {
        register,
        watch,
        control,
        formState: { errors },
        reset,
        handleSubmit
    } = useForm<IFormItem>();

    // funções
    async function onSubmit(data: IFormItem) {
        const item = {
            ...data,
            value: '0,00',
            checked: false,
            user_id: user.id
        }

        try {

            const response = await supabase.from('products').insert([item]).select();

            if (response.status === 201) {

                toast({
                    description: "Produto adicionado com sucesso.",
                    action: <ToastAction altText="Ok">Ok</ToastAction>
                });

                fetchData();

            } else {

            }

            reset();

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Drawer>
            <DrawerTrigger className='flex items-center justify-center'>
                <div
                    onClick={() => console.log('abriu')}
                    className='mb-5 bg-secondary-green rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out text-snow'>
                    <Plus size={32} />
                    <span>Novo Produto</span>
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <DrawerHeader>
                        <DrawerTitle>Adicionar novo produto</DrawerTitle>
                        <DrawerDescription>Preencha o formulário abaixo</DrawerDescription>
                    </DrawerHeader>
                    <div className='flex flex-col gap-5 p-5'>

                        <label htmlFor="name" className='relative flex flex-col'>
                            <span className='text-subtitle'>Nome do produto:</span>
                            <input
                                type="text"
                                placeholder="Digite o nome do produto"
                                className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                                {...register('name', { required: true })}
                            />
                            {errors.name && <span className='text-xs text-red-500'>
                                Campo obrigatório
                            </span>}
                        </label>

                        <label htmlFor="category" className='relative flex flex-col'>
                            <span className='text-subtitle'>Categoria:</span>
                            <ShadSelect control={control}>
                                {CATEGORIES.map(category => (
                                    <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                                ))}
                            </ShadSelect>
                            {errors.category && <span className='text-xs text-red-500'>
                                Campo obrigatório
                            </span>}
                        </label>

                        <label htmlFor="quantity" className='relative flex flex-col'>
                            <span className='text-subtitle'>Quantidade:</span>
                            <input
                                type="number"
                                className='w-36 text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                                {...register('quantity', { required: true })}
                            />
                            {errors.name && <span className='text-xs text-red-500'>
                                Campo obrigatório
                            </span>}
                        </label>

                    </div>
                    <DrawerFooter>
                        <button type='submit' className='flex items-center justify-center w-full bg-primary-green py-2 px-3 rounded text-title'>
                            Adicionar
                        </button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}
