import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
            'h-10 w-full rounded-sketch-notif border-2 border-sketch-border bg-sketch-white px-3 py-2 font-sketch text-base text-title',
            'placeholder:text-title/40',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:border-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',        
            className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
