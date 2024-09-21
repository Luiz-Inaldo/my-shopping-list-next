'use client'
import useMySwal from '@/hooks/useMySwal';
import { RegisterProps } from '@/interfaces/user';
import { supabase } from '@/lib/api';
import { APP_ROUTES } from '@/routes/app-routes';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

export default function Register() {

    const [loading, setLoading] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
    const swal = useMySwal();

    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterProps>();

    async function onSubmit(userCredentials: RegisterProps) {

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: userCredentials.email,
            password: userCredentials.password,
            options: {
                data: {
                    name: userCredentials.username
                }
            }
        });

        if (error) {
            swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Houve algum problema ao cadastrar o usuário",
                confirmButtonText: "Ok"
            })
        } else {
            swal.fire({
                icon: "success",
                title: "Cadastro realizado com sucesso",
                text: "Você receberá um e-mail para confirmar seu cadastro",
                confirmButtonText: "Ok",

            }).then((value) => {
                if (value.isConfirmed) {
                    router.push(APP_ROUTES.public.login.name)
                }
            })
        }

        setLoading(false);

    };

    return (
        <div className='bg-primary-blue max-w-[430px] min-h-screen flex flex-col items-center justify-center'>
            <div className='w-[350px] rounded bg-snow p-5 shadow-md'>
                <h2 className='text-2xl uppercase text-center text-subtitle mb-5 border-b border-[#DDD]'>Cadastre-se</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3' >
                    <label htmlFor="username" className='relative'>
                        <span>Usuário:</span>
                        <input
                            type="text"
                            placeholder='Digite o nome de usuário'
                            {...register('username',
                                {
                                    required: true,
                                    minLength: {
                                        value: 4,
                                        message: 'Deve conter no mínimo 4 caracteres.'
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Deve conter no máximo 20 caracteres.'
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z]+$/,
                                        message: 'Deve conter apenas letras.'
                                    },
                                }
                            )}
                            className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                        />
                        {errors.username && <span className='text-xs text-red-500'>{errors.username.message}</span>}
                    </label>
                    <label htmlFor="email" className='relative'>
                        <span>E-mail:</span>
                        <input
                            type="text"
                            placeholder='Digite seu e-mail'
                            {...register('email',
                                {
                                    required: {
                                        value: true,
                                        message: "Campo obrigatório."
                                    }
                                }
                            )}
                            className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                        />
                        {errors.email && <span className='text-xs text-red-500'>{errors.email.message}</span>}
                    </label>
                    <label htmlFor="password" className='relative'>
                        <span>Senha:</span>
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder='Digite sua senha'
                            {...register('password',
                                {
                                    required: true,
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                        message: 'Deve conter: letra maiúscula, minúscula, número e caractere especial.'
                                    }
                                }
                            )}
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

                        {errors.password && <span className='text-xs text-red-500'>{errors.password.message}</span>}
                    </label>
                    <label htmlFor="confirm_password" className='relative'>
                        <span>Confirmar Senha:</span>
                        <input
                            type={isConfirmPasswordVisible ? 'text' : 'password'}
                            placeholder='Digite sua senha novamente'
                            {...register('confirm_password',
                                {
                                    required: {
                                        value: true,
                                        message: 'É necessário confirmar sua senha.'
                                    }
                                }
                            )}
                            className='w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8'
                        />

                        {isConfirmPasswordVisible ? (
                            <EyeOff
                                size={14}
                                className='absolute right-2 top-[34px] text-paragraph cursor-pointer'
                                onClick={() => setIsConfirmPasswordVisible(false)}
                            />
                        ) : (
                            <Eye
                                size={14}
                                className='absolute right-2 top-[34px] text-paragraph cursor-pointer'
                                onClick={() => setIsConfirmPasswordVisible(true)}
                            />
                        )}

                        {errors.confirm_password && <span className='text-xs text-red-500'>{errors.confirm_password.message}</span>}
                    </label>
                    <button
                        type='submit'
                        className='w-full uppercase flex gap-2 items-center justify-center bg-primary-blue py-2 px-3 rounded text-title mt-10'>
                        {loading ? (
                            <>
                                <span>Cadastrando usuário...</span>
                                <LoaderCircle className='animate-spin' size={18} />
                            </>
                        ) : (
                            <>
                                <span>Registrar</span>
                            </>
                        )}
                    </button>
                </form>
            </div >
        </div >
    )
}
