"use client";
import Footer from '@/components/Footer';
import Header from '@/components/Header'
import LoggedLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProductsContext } from '@/context/ProductsContext';
import useMySwal from '@/hooks/useMySwal';
import { supabase } from '@/lib/api';
import { APP_ROUTES } from '@/routes/app-routes';
import useGeneralUserStore from '@/store/generalUserStore';
import { Blocks, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'

export default function Menu() {

    const user = useGeneralUserStore(store => store.user)

    const swal = useMySwal();
    const router = useRouter();

    async function logout() {

        const { error } = await supabase.auth.signOut();

        if (error) {
            swal.fire({
                toast: true,
                title: 'Erro ao fazer logout',
                icon: 'error',
                timer: 3000,
                timerProgressBar: true,
                position: "bottom-right",
                showConfirmButton: false
            });
        } else {
            swal.fire({
                toast: true,
                title: 'Deslogado com sucesso',
                icon: 'success',
                timer: 3000,
                timerProgressBar: true,
                position: "bottom-right",
                showConfirmButton: false
            });
            setTimeout(() => {
                router.push(APP_ROUTES.public.login.name);
            }, 3000)
        }

    }

    return (
        <LoggedLayout>
            <Header
                content={(_) => (
                    <div className='flex items-center gap-3 cursor-pointer overflow-hidden'>
                        <Avatar className='border-2 border-snow'>
                            <AvatarImage src="images/profile.JPG" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-1'>
                            <p className='text-titledark'>{user?.user_metadata?.name || 'Usuário sem nome.'}</p>
                            <Link href={APP_ROUTES.private.settings.name} className='text-xs text-linkdark underline'>
                                Acessar o perfil
                            </Link>
                        </div>
                    </div>
                )}
            />

            <div className='main-container py-28 px-5 flex flex-col gap-10'>
                <h1 className='text-titledark text-2xl font-bold'>Menu</h1>
                <div className='flex flex-col gap-3'>
                    <Link href={"#"} className='flex gap-4'>
                        <Blocks size={20} className='text-paragraphdark' />
                        <span className='text-linkdark'>Sobre o aplicativo</span>
                    </Link>
                    <button className='flex gap-4' onClick={logout}>
                        <LogOut size={20} className='text-paragraphdark' />
                        <span className='text-linkdark'>Sair</span>
                    </button>
                </div>
            </div>

            <Footer />
        </LoggedLayout>
    )
}
