"use client";
import React, { useEffect, useState} from 'react'
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

export const AddProductForm = () => {
    
    const { toast } = useToast();
    const [bottomLimit, setBottomLimit] = useState<boolean>(false);
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
            checked: false
        }

        try {

            const response = await supabase.from('products').insert([item]).select();

            if (response.status === 201) {

                toast({
                    description: "Produto adicionado com sucesso.",
                    action: <ToastAction altText="Ok">Ok</ToastAction>
                })

            } else {

            }

            reset();

        } catch (error) {
            console.log(error)
        }

    }

    function watchScroll(value: number) {
        if (value > 900 ) {
            setBottomLimit(true);
        } else if (value > 0 && value <= 900) {
            setBottomLimit(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', () => {
            watchScroll(window.scrollY)
        })
        return () => window.removeEventListener('scroll', () => {
            watchScroll(window.scrollY)
        });
    },[])

    return (
        <Drawer>
            <DrawerTrigger>
                <div
                    onClick={() => console.log('abriu')}
                    className={`${bottomLimit ? '' : 'fixed bottom-8 left-1/2 -translate-x-1/2'} w-[60px] h-[60px]  bg-secondary-green rounded-full flex items-center justify-center cursor-pointer shadow-md`}>
                    <Plus className="text-snow" size={32} />
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
