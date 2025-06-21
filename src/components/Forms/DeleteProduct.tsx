import { ProductsContext } from '@/context/ProductsContext';
import { IProductProps } from '@/types';
import React, { useContext, useEffect, useState } from 'react'

export const DeleteProduct = ({ item }: { item: IProductProps | undefined }) => {

    const { modal, setModal, handleDeleteItem } = useContext(ProductsContext);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isFading, setIsFading] = useState<boolean>(false);

    useEffect(() => {
        if (modal.type === 'DELETE_PRODUCT') {
            setIsVisible(true);
            const timer = setTimeout(() => {setIsFading(true)}, 100);
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
                <div className={`${isFading ? 'opacity-100 visible' : 'opacity-0 invisible'} w-[350px] rounded bg-app-container border p-5 transition-all duration-500`}>
                    <h2 className='text-center text-subtitle font-semibold'>Deseja realmente deletar o produto?</h2>
                    <div className='flex gap-2 mt-5'>
                        <button
                            type='button'
                            onClick={() => handleDeleteItem(item!.id)}
                            className='col-span-1 flex items-center justify-center w-full bg-secondary-blue py-2 px-3 rounded text-snow'>
                            Sim
                        </button>
                        <button
                            type='button'
                            onClick={() => setModal({
                                state: 'CLOSED',
                                type: null
                            })}
                            className='col-span-1 flex items-center justify-center w-full border border-subtitle py-2 px-3 rounded text-subtitle'>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}
