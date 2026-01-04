"use client";
import { cn } from '@/lib/utils';
import React from 'react'

const Header = ({ children, className, ...props }: { children: React.ReactNode, className?: string }) => {

    return (
        <header {...props} className={cn("sticky top-0 left-0 right-0 z-[3] shadow bg-app-container flex items-center gap-4 p-4 text-subtitle", className)}>
            {children}
        </header>
    )
}

export default Header
