import { sleep } from '@/functions/sleep';
import { Check, ClipboardList, LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

type NewListProps = {
    listname: string
}

const NonPurchaseList = ({ setPurchase }: { setPurchase: (listname: string) => void }) => {

    const [showInput, setShowInput] = useState<boolean>(false);
    const [isSeting, setIsSeting] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
    } = useForm<NewListProps>();

    const onSubmit = async (data: NewListProps) => {
        setIsSeting(true);
        await sleep(2)
        setPurchase(data.listname);
        setIsSeting(false)
    }

    return (
        <div className="grid place-items-center">
            {isSeting ? (
                <>
                    <LoaderCircle size={70} className='text-subtitle animate-spin mb-5 mt-28' />
                    <span>Um momento... Estamos criando sua lista.</span>
                </>
            ) : (
                <>
                    <Image
                        src={'/images/shopping.svg'}
                        alt="mulher com carrinho de compras"
                        width={150}
                        height={150}
                    />

                    <h2 className="mt-5 text-center max-w-72 text-paragraph">Parece que você ainda não tem nenhuma lista ativa no momento</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className='grid place-items-center mt-10 px-3'>
                        <label htmlFor='listname' className={`${showInput ? 'inline' : 'hidden'} text-subtitle`}>
                            <span>Defina um nome para essa lista:</span>
                            <input
                                type="text"
                                className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                                {...register("listname", {
                                    required: true,
                                })}
                            />
                        </label>

                        {showInput ? (
                            <button
                                type="submit"
                                className='mt-5 bg-primary-green rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out text-title'>
                                <Check size={20} />
                                <span>Vamos começar</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowInput(true)}
                                className='bg-primary-green rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out text-title'>
                                <ClipboardList size={20} />
                                <span>Iniciar nova lista</span>
                            </button>
                        )}
                    </form>
                </>
            )}
        </div>
    )
}

export default NonPurchaseList