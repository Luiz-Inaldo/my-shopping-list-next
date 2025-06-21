"use client";
import { APP_ROUTES } from '@/routes/app-routes';
import { useRouter } from 'next/navigation';
import React from 'react'
import GlobalLoader from '../GlobalLoader';
import { useTheme } from '@/hooks/useTheme';

const VerifyDevice = ({ children }: { children: React.ReactNode }) => {

    const [isMobile, setIsMobile] = React.useState<boolean | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const deviceWidth = window.innerWidth;
        if (deviceWidth <= 640) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    if (isMobile === null) {
        return (
            <GlobalLoader />
        )
    }

    if (isMobile === false) {
        router.push(APP_ROUTES.public.errorDevice.name)
    }

    return (
        <>
            {isMobile && children}
        </>
    )
}

export default VerifyDevice