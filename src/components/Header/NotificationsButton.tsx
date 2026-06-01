'use client';

import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { NotificationsProvider, useNotificationsContext } from '@/context/NotificationsContext';

function NotificationsButtonContent() {
  const { notifications } = useNotificationsContext();
  const hasUnreadNotifications = notifications.length > 0;

  return (
    <Button
      type="button"
      aria-label="Notificações"
      variant="outline"
      size="icon"
      className="relative active:translate-x-[3px] active:translate-y-[3px] active:shadow-sketch-1"
    >
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