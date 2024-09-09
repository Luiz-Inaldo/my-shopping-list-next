import React, { useContext } from 'react'
import { EditProductForm } from '../Forms/EditProductForm'
import { CheckItemForm } from '../Forms/CheckItemForm'
import { IProductProps } from '@/types/product'
import { ProductsContext } from '@/context/ProductsContext'
import { LimitedValueForm } from '../Forms/LimitedValueForm'
import { DeleteProduct } from './DeleteProduct'

type ModalProps = {
    item?: IProductProps;
}

export const Modal = ({ item }: ModalProps) => {

    const { modal } = useContext(ProductsContext);

    return (
        <React.Fragment>
            <div className={`${modal.state === 'OPEN' ? 'h-full top-0' : 'h-0 top-1/2 delay-200'} flex fixed z-[5] items-center justify-center bg-black/30 w-full left-0 transition-all duration-500`}>
                <CheckItemForm item={item} />
                <EditProductForm item={item} />
                <LimitedValueForm />
                <DeleteProduct item={item} />
            </div>
        </React.Fragment>
    )
}
