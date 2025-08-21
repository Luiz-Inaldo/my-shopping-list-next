"use client";
import React from 'react'

const Header = ({ children, ...props }: { children: React.ReactNode }) => {

    return (
        <header {...props} className="flex items-center gap-4 p-4 text-subtitle">
            {children}
        </header>
    )
}

export default Header
