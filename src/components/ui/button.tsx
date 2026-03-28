import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const sketchButtonBaseClassName = cn(
  'inline-flex items-center justify-center gap-2 rounded-sketch-btn shadow-sketch-sm whitespace-nowrap border-2 border-sketch-border font-sketch',
  'transition-[transform,box-shadow,background-color] duration-100',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:ring-offset-0',
  'disabled:pointer-events-none disabled:opacity-50',
  '[&_svg]:pointer-events-none [&_svg]:shrink-0',
);

const buttonVariants = cva(sketchButtonBaseClassName, {
  variants: {
    variant: {
      default: cn(
        'bg-sketch-accent text-white hover:bg-sketch-accent-dk',
      ),
      destructive: cn(
        'bg-sketch-danger text-white hover:bg-sketch-danger/90 hover:shadow-sketch-danger-hover',
      ),
      outline: cn(
        'border-sketch-border bg-sketch-white text-sketch-fg hover:bg-sketch-accent-lt hover:text-sketch-accent-dk',
      ),
      secondary: cn(
        'bg-sketch-fg text-sketch-white hover:bg-sketch-fg/90 hover:text-sketch-white',
      ),
      ghost:
        'border-transparent bg-transparent shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none hover:bg-sketch-accent-lt hover:text-sketch-accent-dk active:translate-x-0 active:translate-y-0',
      link: 'border-transparent bg-transparent px-0 shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0 text-sketch-accent underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-10 min-h-10 px-4 py-2 text-sm font-bold',
      sm: 'h-9 min-h-9 px-3 text-sm font-bold',
      lg: 'h-12 min-h-12 px-8 text-base font-bold',
      icon: 'h-10 min-h-10 w-10 p-0',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
