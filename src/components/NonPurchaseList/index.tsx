import { ProductsContext } from '@/context/ProductsContext';
import { sleep } from '@/functions/sleep';
import { supabase } from '@/lib/api';
import { Check, ClipboardList, LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form';

type NewListProps = {
    list_name: string;
    list_max_value: string;
}

const NonPurchaseList = ({ user }: {
    user: any;
}) => {

    const [showInput, setShowInput] = useState<boolean>(false);
    const [isSeting, setIsSeting] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<NewListProps>();
    const { fetchPurchaseData } = useContext(ProductsContext);

    const onSubmit = async (listData: NewListProps) => {
        setIsSeting(true);
        await sleep(2);

        const { error } = await supabase.from("active_purchases").insert([{
            list_name: listData.list_name,
            list_max_value: listData.list_max_value,
            user_id: user.id
        }]);

        if (error) {
            console.error(error);
        }

        fetchPurchaseData();
        setIsSeting(false)
    }

    return (
        <div className="grid place-items-center">
            {isSeting ? (
                <>
                    <LoaderCircle size={70} className='text-subtitledark animate-spin mb-5 mt-28' />
                    <span className='text-subtitledark text-center'>Um momento... Estamos criando sua lista.</span>
                </>
            ) : (
                <>
                    <Image
                        src={'/images/shopping.svg'}
                        alt="mulher com carrinho de compras"
                        width={150}
                        height={150}
                    />

                    <h2 className="mt-5 text-center max-w-72 text-paragraphdark">Parece que você ainda não tem nenhuma lista ativa no momento</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className='grid place-items-center mt-10 px-3'>
                        <div className={`${showInput ? 'inline' : 'hidden'} flex flex-col gap-3`}>
                            <label htmlFor='list_name' className="text-subtitledark grid gap-1">
                                <span>Defina um nome para essa lista:</span>
                                <input
                                    type="text"
                                    className='w-full text-paragraphdark bg-secondary-dark rounded border border-paragraph/30 px-3 py-2 h-8'
                                    {...register("list_name", {
                                        required: {
                                            value: true,
                                            message: "É necesssário que a lista tenha um nome"
                                        }
                                    })}
                                />

                            </label>

                            <label htmlFor="list_max_value" className="text-subtitledark grid gap-1">
                                <span>Defina um valor máximo para essa lista (R$):</span>
                                <input
                                    type="text"
                                    className='w-full text-paragraphdark bg-secondary-dark rounded border border-paragraph/30 px-3 py-2 h-8'
                                    {...register("list_max_value", {
                                        required: {
                                            value: true,
                                            message: "É necesssário ter um valor máximo para sua segurança"
                                        }
                                    })}
                                />
                            </label>
                        </div>

                        {showInput ? (
                            <button
                                type="submit"
                                className='mt-5 bg-secondary-blue rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out text-titledark'>
                                <Check size={20} />
                                <span>Vamos começar</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowInput(true)}
                                className='bg-secondary-blue rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out text-titledark'>
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