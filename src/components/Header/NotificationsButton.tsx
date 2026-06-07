'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { NotificationsProvider, useNotificationsContext } from '@/context/notificationsContext';
import { APP_ROUTES } from '@/routes/app-routes';

function NotificationsButtonContent() {
  const { notifications } = useNotificationsContext();
  const hasUnreadNotifications = notifications && notifications.length > 0;

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="relative active:translate-x-[3px] active:translate-y-[3px] active:shadow-sketch-1"
    >
      <Link href={APP_ROUTES.private.notifications.name} aria-label="Notificações">
        <Bell
          size={22}
          strokeWidth={2.5}
          className="text-sketch-fg"
          aria-hidden
        />
        {hasUnreadNotifications && (
          <span
            className="absolute right-[7px] top-1.5 size-[9px] rounded-full border-2 border-sketch-bg bg-sketch-danger"
            aria-hidden
          />
        )}
      </Link>
    </Button>
  );
}

export function NotificationsButton() {
  return (
    <NotificationsProvider>
      <NotificationsButtonContent />
    </NotificationsProvider>
  );
}