'use client';
import { ChartSpline, Cog, FileText, House, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const allowedRoutes = [
  {
    path: '/',
    icon: House,
    label: 'Início',
  },
  {
    path: '/historic',
    icon: FileText,
    label: 'Histórico',
  },
  {
    path: '/statistics',
    icon: ChartSpline,
    label: 'Gráficos',
  },
  {
    path: '/ajustes',
    icon: Cog,
    label: 'Ajustes',
  },
  {
    path: '/menu',
    icon: Menu,
    label: 'Mais',
  },
];

const Footer = () => {
  const pathname = usePathname();
  return (
    <footer
      style={{
        boxShadow: '0 0 4px rgb(0 0 0 / 0.1)',
      }}
      className="fixed bottom-0 z-[3] w-full max-w-[430px] mx-auto bg-app-container rounded-tr-2xl rounded-tl-2xl py-2 px-4 flex items-center justify-center"
    >
      <ul className="w-full gap-2 grid grid-cols-5 justify-center">
        {allowedRoutes.map((route) => (
          <motion.li key={route.path} initial={false} className="relative">
            <Link
              prefetch
              href={route.path}
              className={`grid p-2 gap-1 place-items-center relative z-[1] ${pathname === route.path ? 'text-snow' : 'text-subtitle'}`}
            >
              <route.icon size={16} />
              <span className="text-xs">{route.label}</span>
            </Link>
            {pathname === route.path ? (
              <motion.div
                layoutId="background"
                id="background"
                className="absolute inset-0 z-[0] rounded-lg p-2 bg-app-primary"
              />
            ) : null}
          </motion.li>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
