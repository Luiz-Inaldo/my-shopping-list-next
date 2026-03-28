"use client";
import React, { useCallback, useEffect, useState } from 'react'
import DeviceErrorComponent from '../DeviceError';
import { AppLoader } from '../Loader/app-loader';

const VerifyDevice = ({ children }: { children: React.ReactNode }) => {

    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    const checkDeviceWidth = useCallback(() => {
        
        // Verifica se é mobile usando múltiplas estratégias
        const isMobileByUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isMobileByMediaQuery = window.matchMedia('(max-width: 640px)').matches;
        
        // Usa media query como método principal (mais confiável)
        const isMobileDevice = isMobileByMediaQuery || isMobileByUserAgent;
        
        setIsMobile(isMobileDevice);
    }, []);

    useEffect(() => {
        // Verificação inicial
        checkDeviceWidth();
        
        // Media query listener (mais preciso que resize)
        const mediaQuery = window.matchMedia('(max-width: 640px)');
        const handleMediaQueryChange = () => {
            checkDeviceWidth();
        };
        
        // Adiciona listeners
        mediaQuery.addEventListener('change', handleMediaQueryChange);
        window.addEventListener('resize', checkDeviceWidth);
        
        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
            window.removeEventListener('resize', checkDeviceWidth);
        };
    }, [checkDeviceWidth]);

    if (isMobile === null) {
        return (
            <div className="w-full min-h-screen-dvh flex flex-col items-center justify-center bg-app-background">
                <AppLoader size={40} />
            </div>
        )
    }

    if (isMobile === false) {
        return (
            <DeviceErrorComponent />
        )
    }

    return (
        <>
            {isMobile && children}
        </>
    )
}

export default VerifyDevice