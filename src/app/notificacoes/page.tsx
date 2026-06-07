'use client';

import Header from '@/components/Header';
import { NotificationsProvider } from '@/context/notificationsContext';
import { APP_ROUTES } from '@/routes/app-routes';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { NotificationsList } from './_components/NotificationsList';

export default function NotificationsPage() {
  return (
    <div className="sketch-shell min-h-screen flex flex-col">
      <Header className="text-lg font-bold font-sketchHeading">
        <Link href={APP_ROUTES.private.home.name} className="flex items-center gap-1 text-sketch-fg">
          <ChevronLeft size={20} strokeWidth={2.5} />
        </Link>
        <h2 className="leading-none">Notificações</h2>
      </Header>

      <main className="flex-1 px-5 pb-12 pt-8 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <NotificationsProvider all>
          <NotificationsList />
        </NotificationsProvider>
      </main>
    </div>
  );
}
