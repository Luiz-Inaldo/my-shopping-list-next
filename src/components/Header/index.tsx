"use client";
import { cn } from '@/lib/utils';
import React from 'react';

const Header = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string }) => {
  return (
    <header
      {...props}
      className={cn(
        "sticky top-0 left-0 right-0 z-[3] flex items-center gap-4 border-b-2 border-dashed border-sketch-muted bg-sketch-bg px-4 py-4 font-sketch text-sketch-fg",
        className
      )}
    >
      {children}
    </header>
  );
};

export default Header;
