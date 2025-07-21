"use client";
import React from 'react'
import GlobalLoader from '../GlobalLoader';
import DeviceErrorComponent from '../DeviceError';

const VerifyDevice = ({ children }: { children: React.ReactNode }) => {

    const [isMobile, setIsMobile] = React.useState<boolean | null>(null);

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