import { ProductsContext } from '@/context/ProductsContext';
import { IEditItemProps } from '@/types';
import { IProductProps } from '@/types';
import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';

export const EditProductForm = ({ item }: { item: IProductProps | undefined }) => {

    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm<IEditItemProps>();

    const { modal, setModal, handleUpdateItem } = useContext(ProductsContext);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isFading, setIsFading] = useState<boolean>(false);

    async function onSubmit(data: IEditItemProps) {
        handleUpdateItem(data, item!.id);
    }

    useEffect(() => {
        if (modal.type === 'EDIT_PRODUCT') {
            setIsVisible(true);
            const timer = setTimeout(() => { setIsFading(true) }, 100);
            return () => clearTimeout(timer);
        } else {
            setIsFading(false);
            const timer = setTimeout(() => setIsVisible(false), 500);
            return () => clearTimeout(timer);
        }
    }, [modal])

    return (
        <React.Fragment>
            {isVisible && (
                <div className={`${isFading ? 'opacity-100 visible' : 'opacity-0 invisible'} w-[350px] rounded bg-secondary-dark border border-paragraphdark/30 transition-all duration-500`}>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 p-5'>
                        <h1 className='text-subtitledark text-xl text-center'>O que deseja editar no produto?</h1>
                        
                        <label htmlFor="name" className='flex flex-col mt-3'>
                            <span className='text-paragraphdark font-semibold'>Nome:</span>
                            <Controller
                                control={control}
                                name="name"
                                defaultValue={item?.name}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        {...field}
                                        className='w-full text-slate-900 rounded border border-gray-400 px-3 py-2 h-8 text-ellipsis overflow-hidden whitespace-nowrap'
                                    />
                                )}
                            />
                        </label>
                        <div className='grid grid-cols-2 gap-3'>
                            <label htmlFor="value" className='flex flex-col col-span-1'>
                                <span className='text-paragraphdark font-semibold'>Valor:</span>
                                <Controller
                                    control={control}
                                    name="value"
                                    defaultValue={item?.value || '0,00'}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            {...field}
                                            className='w-full text-slate-900 rounded border border-gray-400 px-3 py-2 h-8'
                                        />
                                    )}
                                />
                            </label>
                            <label htmlFor="quantity" className='flex flex-col col-span-1'>
                                <span className='text-paragraphdark font-semibold'>Quantidade:</span>
                                <Controller
                                    control={control}
                                    name="quantity"
                                    defaultValue={item?.quantity}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            {...field}
                                            className='w-full text-slate-900 rounded border border-gray-400 px-3 py-2 h-8'
                                        />
                                    )}
                                />
                            </label>
                        </div>
                        <div className='grid grid-cols-2 gap-2 mt-5'>
                            <button
                                type='submit'
                                className='col-span-1 flex items-center justify-center w-full bg-secondary-blue py-2 px-3 rounded text-snow'>
                                Finalizar Edição
                            </button>
                            <button
                                type='button'
                                onClick={() => setModal({
                                    state: 'CLOSED',
                                    type: null
                                })}
                                className='col-span-1 flex items-center justify-center w-full border border-title py-2 px-3 rounded text-titledark'>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </React.Fragment>
    )
}
