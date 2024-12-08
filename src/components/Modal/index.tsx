import React, { useContext } from 'react'
import { EditProductForm } from '../Forms/EditProductForm'
import { CheckItemForm } from '../Forms/CheckItemForm'
import { IProductProps, IPurchaseProps } from '@/types'
import { ProductsContext } from '@/context/ProductsContext'
import { LimitedValueForm } from '../Forms/LimitedValueForm'
import { DeleteProduct } from '../Forms/DeleteProduct'
import { DeletePurchase } from '../Forms/DeletePurchase'

type ModalProps = {
    item?: IProductProps | IPurchaseProps;
}

export const Modal = ({ item }: ModalProps) => {

    const { modal } = useContext(ProductsContext);

    return (
        <React.Fragment>
            <div className={`${modal.state === 'OPEN' ? 'h-full top-0' : 'h-0 top-1/2 delay-200'} flex fixed z-[5] items-center justify-center bg-black/30 w-full left-0 transition-all duration-500`}>
                {modal.type === 'CHECK_PRODUCT' && <CheckItemForm item={item as IProductProps} />}
                {modal.type === 'EDIT_PRODUCT' && <EditProductForm item={item as IProductProps} />}
                {/* {modal.type === 'LIMIT_VALUE' && <LimitedValueForm />} */}
                {modal.type === 'DELETE_PRODUCT' && <DeleteProduct item={item as IProductProps} />}
                {modal.type === 'DELETE_PURCHASE' && <DeletePurchase purchase={item as IPurchaseProps} />}
            </div>
        </React.Fragment>
    )
}
