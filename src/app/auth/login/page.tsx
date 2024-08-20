'use client'
import { supabase } from '@/lib/api'
import { LoaderCircle, LogInIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

type User = {
    email: string,
    password: string
}

export default function LogIn() {

    const [isAuth, setIsAuth] = useState<boolean>(false);

    const router = useRouter();
    const {
        register,
        handleSubmit
    } = useForm<User>();

    async function onSubmit(userCredentials: User) {

        setIsAuth(true);

        const { data, error } = await supabase.auth.signInWithPassword(userCredentials);

        if (error) {
            console.log("não foi possível fazer login", error.message)
        } else {
            router.push('/');
        }

        setIsAuth(false);

    };

    return (
        <div className='bg-primary-green max-w-[430px] min-h-screen flex flex-col items-center justify-center'>
            <div className='w-[350px] rounded bg-snow p-5 shadow-md'>
                <h2 className='text-2xl uppercase text-center text-subtitle mb-5 border-b border-[#DDD]'>LogIn</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3' >
                    <label htmlFor="email">
                        <span>E-mail:</span>
                        <input
                            type="text"
                            placeholder='Seu e-mail'
                            {...register('email', { required: true })}
                            className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                        />
                    </label>
                    <label htmlFor="password">
                        <span>Senha:</span>
                        <input
                            type="password"
                            placeholder='Sua senha'
                            {...register('password', { required: true })}
                            className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                        />
                    </label>
                    <button
                        type='submit'
                        className='w-full uppercase flex gap-2 items-center justify-center bg-primary-green py-2 px-3 rounded text-title mt-10'>
                        {isAuth ? (
                            <>
                                <span>Autenticando...</span>
                                <LoaderCircle className='animate-spin' size={18} />
                            </>
                        ) : (
                            <>
                                <span>Entrar</span>
                                <LogInIcon size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div >
        </div >
    )
}
