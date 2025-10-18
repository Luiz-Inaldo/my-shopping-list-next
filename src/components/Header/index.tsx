"use client";
import { cn } from '@/lib/utils';
import React from 'react'

const Header = ({ children, className, ...props }: { children: React.ReactNode, className?: string }) => {

    return (
        <header {...props} className={cn("flex items-center gap-4 p-4 text-subtitle", className)}>
            {children}
        </header>
    )
}

export default Header
