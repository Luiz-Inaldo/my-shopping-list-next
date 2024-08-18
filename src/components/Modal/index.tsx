import React, { useContext } from 'react'
import { EditProductForm } from '../Forms/EditProductForm'
import { CheckItemForm } from '../Forms/CheckItemForm'
import { IProductProps } from '@/types/product'
import { ProductsContext } from '@/context/ProductsContext'
import { LimitedValueForm } from '../Forms/LimitedValueForm'

type ModalProps = {
    item?: IProductProps;
}

export const Modal = ({ item }: ModalProps) => {

    const { modal } = useContext(ProductsContext);

    return (
        <div className={`${modal.state === 'OPEN' ? 'flex opacity-100 visible' : 'hidden opacity-0 invisible'} fixed z-[5] items-center justify-center bg-black/30 w-full h-full top-0 left-0 transition-all duration-300`}>
            {modal.type === 'CHECK_PRODUCT' && <CheckItemForm item={item}/>}
            {modal.type === 'EDIT_PRODUCT' && <EditProductForm item={item}/>}
            {modal.type === 'LIMIT_VALUE' && <LimitedValueForm />}
        </div>
    )
}
