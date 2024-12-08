'use client'
import { ProductsContext } from '@/context/ProductsContext';
import { supabase } from '@/lib/api';
import { APP_ROUTES } from '@/routes/app-routes';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import GlobalLoader from '../GlobalLoader';

const SessionVerifier = ({ children }: { children: React.ReactNode }) => {

    const [isSessionVerified, setIsSessionVerified] = useState<boolean | null>(null);
    const { setUser } = useContext(ProductsContext)
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: session } = await supabase.auth.getSession();

            if (session !== null) {
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();

                if (error) {
                    setIsSessionVerified(false);
                } else {
                    setUser(user);
                    setIsSessionVerified(true);
                }
            } else {
                setIsSessionVerified(false);
            }
        };
        fetchUser();
    }, [router]);

    useEffect(() => {
        if (isSessionVerified === false) {
            console.log('renderizando página de login')
            router.push(APP_ROUTES.public.login.name);
        }
    }, [isSessionVerified, router]);

    if (isSessionVerified === null) {
        return (
            <GlobalLoader />
        )
    }

    return (
        <>
            {isSessionVerified && children}
        </>
    )
}

export default SessionVerifier