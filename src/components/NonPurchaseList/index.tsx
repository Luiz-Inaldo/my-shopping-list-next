"use client";
import { ClipboardList } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button';
import NewListForm from '../Forms/NewListForm';

const NonPurchaseList = () => {

    return (
        <div className="grid place-items-center">
            <Image
                src={'/images/shopping.svg'}
                alt="mulher com carrinho de compras"
                width={150}
                height={150}
            />

            <h2 className="mt-5 text-center max-w-72 text-sm text-paragraph">
                Parece que você ainda não tem nenhuma lista ativa no momento
            </h2>

            <NewListForm>
                <Button
                    type="button"
                    className='cursor-pointer shadow-md mt-5'>
                    <ClipboardList size={20} />
                    <span>Iniciar nova lista</span>
                </Button>
            </NewListForm>
        </div>
    )
}

export default NonPurchaseList