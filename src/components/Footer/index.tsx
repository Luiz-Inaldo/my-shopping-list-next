"use client"
import { ChartSpline, FileText, House, Menu, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { AddProductForm } from '../Forms/AddProductForm';
import { APP_ROUTES } from '@/routes/app-routes';
import { ProductsContext } from '@/context/ProductsContext';

const allowedRoutes = ["/", "/settings", "/historic", "/menu", '/statistics']

const Footer = () => {

    const pathname = usePathname();
    const { data, currentPurchase } = useContext(ProductsContext);
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    useEffect(() => {
        if (pathname === "/") {
            setIsAllowed((data && data.length > 0 || currentPurchase) ? true : false);
        } else {
            if (allowedRoutes.includes(pathname)) {
                setIsAllowed(true);
            } else {
                setIsAllowed(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, currentPurchase])

    return (
        <>
            {(isAllowed || data && data.length > 0) && (
                <footer
                    style={{
                        boxShadow: "0 0 4px rgb(0 0 0 / 0.1)"
                    }}
                    className='fixed bottom-0 left-0 z-[3] w-full bg-app-container py-2 px-4 flex items-center justify-center'>
                    <ul className='w-full gap-2 grid grid-cols-5 justify-center'>
                        <li>
                            <Link href={APP_ROUTES.private.home.name} className={`grid gap-1 p-2 place-items-center border-b ${pathname === "/" ? "text-default-green dark:text-title border-default-green dark:border-title" : "text-subtitle border-transparent"}`}>
                                <House size={16} />
                                <span className='text-xs'>Início</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={APP_ROUTES.private.historic.name} className={`grid gap-1 p-2 place-items-center border-b ${pathname === "/historic" ? "text-default-green dark:text-title border-default-green dark:border-title" : "text-subtitle border-transparent"}`}>
                                <FileText size={16} />
                                <span className='text-xs'>Histórico</span>
                            </Link>
                        </li>
                        {pathname === "/" ? (
                            <AddProductForm />
                        ) : (
                            <li>
                                <Link href={APP_ROUTES.private.settings.name} className={`grid gap-1 p-2 place-items-center border-b ${pathname === "/settings" ? "text-default-green dark:text-title border-default-green dark:border-title" : "text-subtitle border-transparent"}`}>
                                    <SlidersHorizontal size={16} />
                                    <span className='text-xs'>Ajustes</span>
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link href={APP_ROUTES.private.statistics.name} className={`grid gap-1 p-2 place-items-center border-b ${pathname === "/statistics" ? "text-default-green dark:text-title border-default-green dark:border-title" : "text-subtitle border-transparent"}`}>
                                <ChartSpline size={16} />
                                <span className='text-xs'>Gráficos</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={APP_ROUTES.private.menu.name} className={`grid gap-1 p-2 place-items-center border-b ${pathname === "/menu" ? "text-default-green dark:text-title border-default-green dark:border-title" : "text-subtitle border-transparent"}`}>
                                <Menu size={16} />
                                <span className='text-xs'>Mais</span>
                            </Link>
                        </li>
                    </ul>
                </footer>
            )}
        </>
    )
}

export default Footer;
