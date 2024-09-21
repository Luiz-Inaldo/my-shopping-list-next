'use client'
import useMySwal from '@/hooks/useMySwal';
import { User } from '@/interfaces/user';
import { supabase } from '@/lib/api'
import { APP_ROUTES } from '@/routes/app-routes';
import { Eye, EyeOff, LoaderCircle, LogInIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

export default function LogIn() {

    const [loading, setLoading] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const swal = useMySwal();

    const router = useRouter();
    const {
        register,
        handleSubmit
    } = useForm<User>();

    async function onSubmit(userCredentials: User) {

        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword(userCredentials);

        if (error) {
            if (error.code === 'invalid_credentials') {
                swal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: "Credenciais de login inválidas, ou não existem.",
                    confirmButtonText: "Ok"
                })
            } else {
                swal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: "Houve um erro ao tentar o login.",
                    confirmButtonText: "Ok"
                })
            }
        } else {
            swal.fire({
                icon: "success",
                toast: true,
                position: "bottom-right",
                text: "Login realizado com sucesso.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            })
            setTimeout(() => router.push(APP_ROUTES.private.home.name), 2000)

        }

        setLoading(false);

    };

    return (
        <div className='bg-primary-blue max-w-[430px] min-h-screen flex flex-col items-center justify-center'>
            <div className='w-[350px] rounded bg-snow p-5 shadow-md'>
                <h2 className='text-2xl uppercase text-center text-subtitle mb-5 border-b border-[#DDD]'>SignIn</h2>
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
                    <label htmlFor="password" className='relative'>
                        <span>Senha:</span>
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder='Sua senha'
                            {...register('password', { required: true })}
                            className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                        />

                        {isPasswordVisible ? (
                            <EyeOff
                                size={14}
                                className='absolute right-2 top-[34px] text-paragraph cursor-pointer'
                                onClick={() => setIsPasswordVisible(false)}
                            />
                        ) : (
                            <Eye
                                size={14}
                                className='absolute right-2 top-[34px] text-paragraph cursor-pointer'
                                onClick={() => setIsPasswordVisible(true)}
                            />
                        )}

                    </label>
                    <button
                        type='submit'
                        className='w-full uppercase flex gap-2 items-center justify-center bg-primary-blue py-2 px-3 rounded text-title mt-10'>
                        {loading ? (
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
