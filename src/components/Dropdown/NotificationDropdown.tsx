'use client';

import { Bell, CheckCircle2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNotificationsQuery } from '@/hooks/queries/notifications';
import { APP_ROUTES } from '@/routes/app-routes';
import { defaultAvatarImgUrl } from '@/constants/avatarImgUrl';
import { useEffect } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { markNotificationAsRead } from '@/services/notificationsServices';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { tryCatchRequest } from '@/functions/requests';

function formatNotificationDate(timestamp: Timestamp): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp.toDate());
}

export function NotificationDropdown() {
  const { data: notifications, newNotificationSignal } = useNotificationsQuery();
  const hasNotifications = !!notifications?.length;
  const bellControls = useAnimationControls();

  useEffect(() => {
    if (newNotificationSignal === 0) return;
    bellControls.start({
      rotate: [0, -18, 16, -12, 8, -4, 0],
      transition: { duration: 0.7, ease: 'easeInOut' },
    });
  }, [newNotificationSignal, bellControls]);

  async function handleMarkAsRead(e: React.MouseEvent, notificationId: string) {
    e.stopPropagation();
    const [_, error] = await tryCatchRequest<void, Error>(() => markNotificationAsRead(notificationId));
    if (error) {
      console.error(error);
      sendToastMessage({
        title: 'Erro ao marcar notificação como lida',
        type: 'error',
      });
      return;
    }

    sendToastMessage({
        title: 'Notificação marcada como lida',
        type: 'success',
      });
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
                onSelect={(e) => e.preventDefault()}
              >
                <Avatar className="h-9 w-9 shrink-0 border-2 border-sketch-border rounded-full">
                  <AvatarImage
                    src={notification.sender_info.profile_img}
                    alt={notification.sender_info.name}
                  />
                  <AvatarFallback>
                    <img src={defaultAvatarImgUrl} alt="avatar" width={36} height={36} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  <p className="font-sketch text-sm leading-snug text-title line-clamp-2">
                    {notification.body}
                  </p>
                  <p className="font-sketch text-xs text-paragraph">
                    {formatNotificationDate(notification.created_at)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Marcar como lida"
                  className="mt-0.5 shrink-0 text-success transition-all hover:text-sketch-fg active:scale-50 duration-200"
                  onClick={(e) => handleMarkAsRead(e, notification.id)}
                >
                  <CheckCircle2 size={18} strokeWidth={2} aria-hidden />
                </button>
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
