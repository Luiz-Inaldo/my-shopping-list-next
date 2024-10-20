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
import { ShadSelect } from '../Select'
import { SelectItem } from '../ui/select'
import { CATEGORIES } from '@/constants/constants'
import { supabase } from '@/lib/api'
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from '../ui/toast'
import { ProductsContext } from '@/context/ProductsContext';
import { IFormItem } from '@/types';

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
            user_id: user.id
        }
        if (item.value === "") {
            item.value = "0,00"
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
                    onClick={() => {}}
                    className='mb-2 bg-secondary-blue rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out text-snow'>
                    <Plus className='svg-shadow' size={20} />
                    <span className='text-shadow-base'>Novo Produto</span>
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

                        <label htmlFor="category" className='relative flex flex-col col-span-1'>
                            <span className='text-subtitle'>Categoria:</span>
                            <ShadSelect control={control} label='Escolha a categoria' name="category">
                                {CATEGORIES.map(category => (
                                    <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                                ))}
                            </ShadSelect>
                            {errors.category && <span className='text-xs text-red-500'>
                                Campo obrigatório
                            </span>}
                        </label>

                        <div className='grid grid-cols-2 gap-2'>
                            <label htmlFor="quantity" className='relative flex flex-col col-span-1'>
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

                            <label htmlFor="value" className='relative flex flex-col'>
                                <span className='text-subtitle'>Valor:</span>
                                <input
                                    type="text"
                                    defaultValue={"0,00"}
                                    placeholder="Digite o valor do produto"
                                    className='w-36 text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                                    {...register('value')}
                                />
                            </label>
                        </div>


                        <label htmlFor="checked" className='relative flex items-center gap-5'>
                            <span className='text-subtitle'>Já adquirido?</span>
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-primary-blue border-2 border-paragraph rounded"
                                {...register('checked')}
                            />
                        </label>


                    </div>
                    <DrawerFooter>
                        <button type='submit' className='flex items-center justify-center w-full bg-primary-blue py-2 px-3 rounded text-title'>
                            Adicionar
                        </button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}
