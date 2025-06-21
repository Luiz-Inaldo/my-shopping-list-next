"use client";
import React, { useEffect, useRef, useState } from 'react'

const Header = ({ content }: {
    content: (_: any, visible?:boolean) => React.ReactNode;
}) => {

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
        <header ref={headerRef} className="fixed top-0 left-0 z-[3] w-full p-4 bg-app-primary flex items-center justify-between transition-shadow duration-500">
            {content(this, isIconVisible)}
        </header>
    )
}

export default Header
