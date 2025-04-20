'use client';
import Header from '@/components/Header';
import LoggedLayout from '@/components/layout/MainLayout';
import ThemeSwitcher from '@/components/Switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductsContext } from '@/context/ProductsContext';
import { EllipsisVertical, Lock, Palette, Pencil } from 'lucide-react';
import React, { useContext } from 'react'

export default function Settings() {

    const { user } = useContext(ProductsContext);

    return (
        <LoggedLayout>
            <Header
                content={(_) => (
                    <h2 className="text-titledark text-lg">Ajustes</h2>
                )}
            />
            <main className='main-container py-28 px-5 flex flex-col gap-8'>
                <div className='flex gap-5 items-center bg-secondary-dark p-4 rounded-sm'>
                    <div className='relative'>
                        <Avatar className='w-[70px] h-[70px]'>
                            <AvatarImage src="images/profile.JPG" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <button className='cursor-pointer absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 rounded-full bg-secondary-blue'>
                            <EllipsisVertical size={12} className='text-subtitledark' />
                        </button>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-titledark'>{user?.user_metadata?.name || 'Usuário sem nome.'}</p>
                        <p className='text-sm text-subtitledark/50'>{user?.email}</p>
                    </div>
                </div>
                <div>
                    <h2 className='text-subtitledark/50 mb-3'>Ajustes do perfil</h2>
                    <div className='grid gap-3 bg-secondary-dark p-4 rounded-sm'>
                        <div className="flex gap-3 items-center text-subtitledark">
                            <Lock size={16} />
                            <p>Alterar senha</p>
                        </div>
                        <div className="flex gap-3 items-center text-subtitledark">
                            <Pencil size={16} />
                            <p>Alterar apelido</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className='text-subtitledark/50 mb-3'>Ajustes do sistema</h2>
                    <div className='grid gap-3 bg-secondary-dark p-4 rounded-sm'>
                        <div className="flex gap-3 items-center justify-between text-subtitledark">
                            <div className="flex gap-3 items-center">
                                <Palette size={16} />
                                <p>Tema: Dark</p>
                            </div>
                            <ThemeSwitcher />
                        </div>
                    </div>
                </div>
            </main>
        </LoggedLayout>
    )
}
