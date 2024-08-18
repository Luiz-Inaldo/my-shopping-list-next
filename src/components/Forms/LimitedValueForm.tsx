import { ProductsContext } from '@/context/ProductsContext';
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';

export const LimitedValueForm = () => {

    const {
        register,
        handleSubmit
    } = useForm<{ max_value: string }>();

    const { setModal } = useContext(ProductsContext);

    function onSubmit(data: { max_value: string }) {

        const value = parseFloat(data.max_value);

        localStorage.setItem('STIPULATED_VALUE', JSON.stringify(value.toFixed(2).replace('.', ',')));
        setModal({
            state: 'CLOSED',
            type: ''
        });
    }

    return (
        <div className='w-[350px] rounded bg-snow p-5'>
            <form onSubmit={handleSubmit(onSubmit)} >
                <h2 className='text-xl text-center text-subtitle mb-5 border-b border-paragraph'>Bem-vindo, usuário!</h2>
                <p className='text-paragraph text-center'>
                    Identificamos que você não definiu nenhum valor estipulado para suas compras.
                    Se desejar, informe o valor máximo que deseja gastar nas compras*
                </p>
                <input
                    type="text"
                    placeholder='Informe o valor máximo'
                    {...register('max_value', { required: true })}
                    className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8 mt-10'
                />
                <div className='grid grid-cols-2 gap-2 my-5'>
                    <button
                        type='submit'
                        className='col-span-1 flex items-center justify-center w-full bg-primary-green py-2 px-3 rounded text-title'>
                        Definir Valor
                    </button>
                    <button
                        type='button'
                        onClick={() => setModal({
                            state: 'CLOSED',
                            type: ''
                        })}
                        className='col-span-1 flex items-center justify-center w-full border border-title py-2 px-3 rounded text-title'>
                        Agora não!
                    </button>
                </div>
                <p className='text-xs text-paragraph text-center'>
                    *(esse valor poderá ser alterado a qualquer momento nas configurações do aplicativo)
                </p>
            </form>
        </div>
    )
}
