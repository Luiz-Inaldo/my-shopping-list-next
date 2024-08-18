import { ProductsContext } from '@/context/ProductsContext';
import { IEditItemProps } from '@/types/editItem';
import { IProductProps } from '@/types/product';
import React, { useContext } from 'react'
import { Controller, useForm } from 'react-hook-form';

export const CheckItemForm = ({ item }: { item: IProductProps | undefined }) => {

    const {
        register,
        control,
        formState: { errors },
        handleSubmit
    } = useForm<IEditItemProps>();

    console.log(item)

    const { setModal, handleCheckItem } = useContext(ProductsContext);

    async function onSubmit(data: IEditItemProps) {
        handleCheckItem(item!, data);
    }

    return (
        <div className='relative w-[350px] rounded bg-snow'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 p-5'>
                <h1 className='text-subtitle text-xl text-center'>Quanto você pagará por esse produto?</h1>
                <label htmlFor="value" className='flex flex-col'>
                    <input
                        defaultValue={item?.value}
                        type="text"
                        {...register('value', { required: true })}
                        placeholder="R$: 0,00"
                        className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8 text-ellipsis overflow-hidden whitespace-nowrap'
                    />
                </label>
                <div className='grid grid-cols-2 gap-2 mt-5'>
                    <button
                        type='submit'
                        className='col-span-1 flex items-center justify-center w-full bg-primary-green py-2 px-3 rounded text-title'>
                        Marcar Produto
                    </button>
                    <button
                        type='button'
                        onClick={() => setModal({
                            state: 'CLOSED',
                            type: ''
                        })}
                        className='col-span-1 flex items-center justify-center w-full border border-title py-2 px-3 rounded text-title'>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}
