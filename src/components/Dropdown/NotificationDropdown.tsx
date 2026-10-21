'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationItem } from '@/components/Notifications/NotificationItem';
import { useNotificationsQuery } from '@/hooks/queries/notifications';
import { APP_ROUTES } from '@/routes/app-routes';
import { useEffect } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { handleMarkNotificationAsRead } from '@/services/notificationsServices';
import { useRouter } from 'next/navigation';

export function NotificationDropdown() {
  const { data: notifications, newNotificationSignal } = useNotificationsQuery();
  const hasNotifications = !!notifications?.length;
  const bellControls = useAnimationControls();
  const router = useRouter();

  useEffect(() => {
    if (newNotificationSignal === 0) return;
    bellControls.start({
      rotate: [0, -18, 16, -12, 8, -4, 0],
      transition: { duration: 0.7, ease: 'easeInOut' },
    });
  }, [newNotificationSignal, bellControls]);

  function handleMarkAsRead(e: React.MouseEvent, notificationId: string) {
    e.stopPropagation();
    handleMarkNotificationAsRead(notificationId);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          aria-label="Notificações"
          variant="outline"
          size="icon"
          className="active:translate-x-[3px] active:translate-y-[3px] active:shadow-sketch-1 relative"
        >
          <motion.span
            animate={bellControls}
            style={{ display: 'inline-flex', transformOrigin: 'top center' }}
          >
            <Bell size={22} strokeWidth={2.5} className="text-sketch-fg" aria-hidden />
          </motion.span>
          {hasNotifications && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [1,1.8,1] }}
              transition={{ duration: 0.2, stiffness: 100 }}
              className="absolute right-[7px] top-1.5 size-[9px] rounded-full border-2 border-sketch-bg bg-sketch-danger"
              aria-hidden
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-sketch-notif border-2 border-sketch-border">
        {!hasNotifications ? (
          <div className="px-4 py-6 text-center">
            <p className="font-sketch text-sm text-paragraph">Nenhuma notificação</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 px-3 py-3 focus:bg-sketch-accent-lt"
                onSelect={(e) => {
                  e.preventDefault();
                  router.push(APP_ROUTES.private.shoppingList.name(notification.metadata.purchase_id as string));
                }}
              >
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  clampBody
                />
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className="px-3 py-2">
              <a
                href={APP_ROUTES.private.notifications.name}
                className="font-sketch text-sm text-sketch-accent hover:underline"
              >
                Ver todas as notificações
              </a>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
