'use client';
import { ChartSpline, Cog, FileText, House, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
const allowedRoutes = [
  { path: '/', icon: House, label: 'Início' },
  { path: '/historic', icon: FileText, label: 'Histórico' },
  { path: '/statistics', icon: ChartSpline, label: 'Gráficos' },
  { path: '/ajustes', icon: Cog, label: 'Ajustes' },
  { path: '/menu', icon: Menu, label: 'Mais' },
];

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer
      className="fixed bottom-0 z-[3] mx-auto flex h-[72px] w-full max-w-[430px] items-center justify-center rounded-sketch-footer-top border-t-2 border-sketch-border bg-sketch-white px-2 py-2"
    >
      <ul className="grid w-full grid-cols-5 justify-center gap-1">
        {allowedRoutes.map((route) => {
          const active = pathname === route.path;
          return (
            <li key={route.path} className="relative flex justify-center">
              <Link
                prefetch
                href={route.path}
                className={cn(
                  'relative z-[1] grid min-w-[64px] place-items-center gap-0.5 rounded-sketch-nav-item p-2 transition-transform duration-100 hover:-rotate-1 active:scale-95',
                  active
                    ? 'border-2 border-sketch-accent bg-sketch-accent-lt text-sketch-accent-dk shadow-sketch-nav'
                    : 'border-2 border-transparent text-title',
                )}
              >
                <route.icon
                  size={22}
                  strokeWidth={2.5}
                  className={cn(
                    active ? 'text-sketch-accent-dk' : 'text-sketch-fg',
                  )}
                />
                <span
                  className={cn(
                    'font-sketch text-[11px] leading-none',
                    active ? 'font-bold text-sketch-accent-dk' : 'text-title opacity-60',
                  )}
                >
                  {route.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </footer>
  );
};

export default Footer;
