'use client'
import { ProductsContext } from '@/context/ProductsContext';
import { supabase } from '@/lib/api';
import { APP_ROUTES } from '@/routes/app-routes';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import GlobalLoader from '../GlobalLoader';
import useGeneralUserStore from '@/store/generalUserStore';
import { TSupabaseUserInfo } from '@/types/supabase';
import { useTheme } from '@/hooks/useTheme';

const SessionVerifier = ({ children }: { children: React.ReactNode }) => {

    const [isSessionVerified, setIsSessionVerified] = useState<boolean | null>(null);
    const { theme } = useTheme();
    // const { setUser } = useContext(ProductsContext)
    const setUser = useGeneralUserStore(store => store.setUser)
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
                    setUser(user as unknown as TSupabaseUserInfo);
                    setIsSessionVerified(true);
                }
            } else {
                setIsSessionVerified(false);
            }
        };
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    useEffect(() => {
        if (isSessionVerified === false) {
            router.push(APP_ROUTES.public.inicio.name);
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