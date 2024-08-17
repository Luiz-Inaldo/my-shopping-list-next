import { ProductsContext } from '@/context/ProductsContext';
import { IEditItemProps } from '@/types/editItem';
import { IProductProps } from '@/types/product';
import React, { useContext } from 'react'
import { Controller, useForm } from 'react-hook-form';

export const EditProductForm = ({ item, editFormOpen, setEditFormOpen }: { item: IProductProps, editFormOpen: boolean, setEditFormOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm<IEditItemProps>();

    const { handleUpdateItem } = useContext(ProductsContext);

    async function onSubmit(data: IEditItemProps) {
        handleUpdateItem(data, item.id);
    }

    return (
        <div className={`${editFormOpen ? 'flex opacity-100 visible' : 'hidden opacity-0 invisible'} fixed z-[5] items-center justify-center bg-black/30 w-full h-full top-0 left-0 transition-all duration-300`}>
            <div className='relative w-[350px] rounded bg-snow'>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 p-5'>
                    <h1 className='text-subtitle text-xl text-center'>O que deseja editar no produto?</h1>
                    <hr />
                    <label htmlFor="name" className='flex flex-col'>
                        <span className='text-subtitle'>Nome:</span>
                        <Controller
                            control={control}
                            name="name"
                            defaultValue={item.name}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    {...field}
                                    className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8 text-ellipsis overflow-hidden whitespace-nowrap'
                                />
                            )}
                        />
                    </label>
                    <div className='grid grid-cols-2 gap-3'>
                        <label htmlFor="value" className='flex flex-col col-span-1'>
                            <span className='text-subtitle'>Valor:</span>
                            <Controller
                                control={control}
                                name="value"
                                defaultValue={item.value || '0,00'}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        {...field}
                                        className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                                    />
                                )}
                            />
                        </label>
                        <label htmlFor="quantity" className='flex flex-col col-span-1'>
                            <span className='text-subtitle'>Quantidade:</span>
                            <Controller
                                control={control}
                                name="quantity"
                                defaultValue={item.quantity}
                                render={({ field }) => (
                                    <input
                                        type="number"
                                        {...field}
                                        className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                                    />
                                )}
                            />
                        </label>
                    </div>
                    <div className='grid grid-cols-2 gap-2 mt-5'>
                        <button
                            type='submit'
                            className='col-span-1 flex items-center justify-center w-full bg-primary-green py-2 px-3 rounded text-title'>
                            Finalizar Edição
                        </button>
                        <button
                            type='button'
                            onClick={() => setEditFormOpen(false)}
                            className='col-span-1 flex items-center justify-center w-full border border-title py-2 px-3 rounded text-title'>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
