import React, { useContext } from 'react'
import Menu from '../Menu'
import { ProductsContext } from '@/context/ProductsContext';

const LoggedLayout = ({ children }: { children: React.ReactNode }) => {

    const { user } = useContext(ProductsContext);

    return (
        <>
            <header className="relative w-full p-4 bg-primary-green shadow-md flex items-center gap-4">
                <Menu user={user} />
                <h1 className="text-2xl font-bold text-title">
                    Minha lista de compras
                </h1>
            </header>
            {children}
        </>
    )
}

export default LoggedLayout