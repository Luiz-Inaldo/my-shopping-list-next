"use client"
import { ChartSpline, FileText, House, Menu, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { AddProductForm } from '../Forms/AddProductForm';
import { APP_ROUTES } from '@/routes/app-routes';
import { ProductsContext } from '@/context/ProductsContext';

const allowedRoutes = ["/", "/settings", "/historic"]

const Footer = () => {

    const pathname = usePathname();
    const { data, currentPurchase } = useContext(ProductsContext);
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    useEffect(() => {
        if (pathname === "/") {
            setIsAllowed((data.length > 0 && currentPurchase) ? true : false);
        } else {
            if (allowedRoutes.includes(pathname)) {
                setIsAllowed(true);
            } else {
                setIsAllowed(false);
            }
        }
    }, [data, currentPurchase])

    return (
        <>
            {(isAllowed || data.length > 0) && (
                <footer
                    style={{
                        boxShadow: "0 -3px 4px rgb(0 0 0 / 0.1)"
                    }}
                    className='sticky bottom-0 left-0 z-[3] bg-secondary-dark py-2 px-4 flex items-center justify-center'>
                    <ul className='flex flex-1 items-center justify-between'>
                        <li>
                            <Link href={APP_ROUTES.private.home.name} className={`grid gap-1 p-2 place-items-center border-b ${pathname === "/" ? "text-link border-link" : "text-paragraph border-transparent"}`}>
                                <House size={16} />
                                <span className='text-xs'>Início</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={APP_ROUTES.private.historic.name} className={`grid gap-1 p-2 place-items-center border-b ${pathname === "/historic" ? "text-link border-link" : "text-paragraph border-transparent"}`}>
                                <FileText size={16} />
                                <span className='text-xs'>Histórico</span>
                            </Link>
                        </li>
                        {pathname === "/" ? (
                            <AddProductForm />
                        ) : (
                            <li>
                                <Link href={APP_ROUTES.private.settings.name} className={`grid gap-1 p-2 place-items-center border-b ${pathname === "/settings" ? "text-link border-link" : "text-paragraph border-transparent"}`}>
                                    <SlidersHorizontal size={16} />
                                    <span className='text-xs'>Ajustes</span>
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link href={""} className={`grid gap-1 p-2 place-items-center border-b ${pathname === "/statistics" ? "text-link border-link" : "text-paragraph border-transparent"}`}>
                                <ChartSpline size={16} />
                                <span className='text-xs'>Estatísticas</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={""} className={`grid gap-1 p-2 place-items-center border-b ${pathname === "/more" ? "text-link border-link" : "text-paragraph border-transparent"}`}>
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
