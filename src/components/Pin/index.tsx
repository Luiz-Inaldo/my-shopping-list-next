import type { SVGProps } from 'react';

import { cn } from '@/lib/utils';

export interface PinProps extends SVGProps<SVGSVGElement> {
  size?: number;
  'aria-label'?: string;
}

export function Pin({
  className,
  size = 28,
  'aria-label': ariaLabel,
  ...props
}: PinProps) {
  const height = Math.round(size * 1.2);
  const decorative = !ariaLabel;

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 32 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block shrink-0', className)}
      aria-hidden={decorative ? true : undefined}
      aria-label={ariaLabel}
      role={decorative ? undefined : 'img'}
      {...props}
    >
      <circle cx="16" cy="11" r="7.5" className="fill-sketch-danger" />
      <ellipse
        cx="12.5"
        cy="8"
        rx="2.2"
        ry="1.6"
        className="fill-sketch-white/40"
      />
      <line
        x1="16"
        y1="18.5"
        x2="16"
        y2="30.5"
        strokeWidth="2.25"
        strokeLinecap="round"
        className="stroke-sketch-border"
      />
    </svg>
  );
}
