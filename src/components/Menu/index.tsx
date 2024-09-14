import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartSpline, House, LogOut, MenuIcon, ScrollText, Settings } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { supabase } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { APP_ROUTES } from '@/routes/app-routes'
import useMySwal from '@/hooks/useMySwal'

const Menu = ({ user }: { user: User | null }) => {

    const router = useRouter();
    const Swal = useMySwal();
    const date = new Date();

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            Swal.fire({
                toast: true,
                text: "Logout realizado. Até a próxima!",
                icon: "success",
                timer: 2000,
                timerProgressBar: true,
                position: "bottom-right",
                showConfirmButton: false
            })
            setTimeout(() => {
                router.push(APP_ROUTES.public.login.name)
            }, 2000);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            <Sheet>
                <SheetTrigger>
                    <MenuIcon size={20} />
                </SheetTrigger>
                <SheetContent side={'left'}>
                    <SheetHeader className='h-full'>
                        <SheetTitle className='text-left pb-2 border-b text-subtitle flex items-end gap-2'>
                            <Avatar className='avatar-shadow-minor'>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            Olá, {user?.user_metadata.name || 'Usuário sem nome.'}
                        </SheetTitle>
                        <SheetDescription className='text-left h-full text-base flex flex-col justify-between'>
                            <ul className='grid text-paragraph mt-5'>
                                <li className='py-2'>
                                    <Link href="/" className='flex items-center gap-2 cursor-pointer'>
                                        <House size={16} />
                                        Página Inicial
                                    </Link>
                                </li>
                                <li className='py-2'>
                                    <Link href="/" className='flex items-center gap-2 cursor-pointer'>
                                        <ScrollText size={16} />
                                        Histórico
                                    </Link>
                                </li>
                                <li className='py-2'>
                                    <Link href="/" className='flex items-center gap-2 cursor-pointer'>
                                        <ChartSpline size={16} />
                                        Estatísticas
                                    </Link>
                                </li>
                                <li className='py-2'>
                                    <Link href="/" className='flex items-center gap-2 cursor-pointer'>
                                        <Settings size={16} />
                                        Configurações
                                    </Link>
                                </li>
                                <li
                                    onClick={logout}
                                    className='py-2 flex items-center gap-2 cursor-pointer'>
                                    <LogOut size={16} />
                                    Sair
                                </li>
                            </ul>
                            <p className='text-xs text-center py-1 border-t border-b border-gray-300'>{date.getFullYear()}&copy;, desenvolvido por Luiz Inaldo</p>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </React.Fragment>
    )
}

export default Menu