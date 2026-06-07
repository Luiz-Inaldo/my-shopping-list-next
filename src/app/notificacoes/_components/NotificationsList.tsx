'use client';

import { Inbox } from 'lucide-react';
import { useNotificationsContext } from '@/context/notificationsContext';
import { Card, CardContent } from '@/components/ui/card';
import { TNotificationProps } from '@/types/notifications';
import { useEffect, useState } from 'react';
import { NotificationItem } from './NotificationItem';
import { NotificationsListSkeleton } from '@/components/Skeletons/NotificationsListSkeleton';

export function NotificationsList() {
  const { notifications, isLoading } = useNotificationsContext();

  function handleMarkAsRead(id: string) {
    return
  }

  function handleUpdateInvitation(id: string, status: 'accepted' | 'rejected') {
    return
  }

  if (isLoading) {
    return <NotificationsListSkeleton />;
  }

  if (notifications && notifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-sketch-avatar border-2 border-sketch-border bg-sketch-accent-lt text-sketch-accent-dk">
            <Inbox size={28} strokeWidth={2.4} aria-hidden />
          </div>
          <div className="space-y-1">
            <h2 className="font-sketchHeading text-xl text-sketch-fg">Sem notificações</h2>
            <p className="font-sketch text-sm text-sketch-fg/70">
              Quando alguém interagir com suas listas, as notificações aparecem aqui.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications?.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
          onUpdateInvitation={handleUpdateInvitation}
        />
      ))}
    </div>
  );
}