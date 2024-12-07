"use client";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ChevronRight, SlidersHorizontal } from 'lucide-react'
import { ProductsContext } from '@/context/ProductsContext';
import Link from 'next/link';
import { APP_ROUTES } from '@/routes/app-routes';

const Header = () => {

    const { user } = useContext(ProductsContext);
    const [isIconVisible, setIsIconVisible] = useState<boolean>(true);
    const headerRef = useRef<HTMLHeadElement | null>(null);

    useEffect(() => {
        function handleScroll() {
            if (headerRef.current) {

                const scrollY = window.scrollY;
                if (scrollY > 70 && headerRef.current) {
                    headerRef.current.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
                    setIsIconVisible(false);
                } else {
                    headerRef.current.style.boxShadow = "none";
                    setIsIconVisible(true);
                }

            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    return (
        <header ref={headerRef} className="fixed top-0 left-0 z-[3] w-full p-4 bg-secondary-dark flex items-center justify-between transition-shadow duration-500">
            <div className='flex items-center gap-3 cursor-pointer overflow-hidden'>
                <Avatar className='border-2 border-snow'>
                    <AvatarImage src="images/profile.JPG" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex items-center'>
                    <p className={`${isIconVisible ? "max-w-[89px] mr-1" : "max-w-0"} overflow-hidden whitespace-nowrap text-titledark transition-all duration-200`}>
                        Bem-vindo,
                    </p>
                    <p className='text-titledark'>{user?.user_metadata?.name || 'Usuário sem nome.'}</p>
                    <ChevronRight size={16} className={`${isIconVisible ? "opacity-100 translate-x-0 ml-2" : "opacity-0 -translate-x-full"} transition-all duration-200 text-titledark`} />
                </div>
            </div>
            <Link href={APP_ROUTES.private.settings.name}>
                <SlidersHorizontal size={20} className='cursor-pointer text-titledark' />
            </Link>
        </header>
    )
}

export default Header
