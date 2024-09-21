'use client'
import React, { useContext } from 'react'
import Menu from '../Menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductsContext } from '@/context/ProductsContext'

const LoggedLayout = ({ children }: { children: React.ReactNode }) => {

    const { user } = useContext(ProductsContext)

    return (
        <>
            <header className="relative w-full p-4 bg-[#89CFF0] shadow-md flex items-center justify-between">
                <div className='flex items-center gap-3'>
                    <Avatar className='avatar-shadow-minor'>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className='font-semibold text-lg'>Olá, {user?.user_metadata?.name || 'Usuário sem nome.'}</p>
                </div>
                <Menu />

            </header>
            {children}
        </>
    )
}

export default LoggedLayout