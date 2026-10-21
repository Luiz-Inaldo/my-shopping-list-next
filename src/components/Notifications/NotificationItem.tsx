'use client';

import { CheckCircle2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { defaultAvatarImgUrl } from '@/constants/avatarImgUrl';
import { TNotification } from '@/types/notifications';
import { cn } from '@/lib/utils';

function formatNotificationDate(timestamp: Timestamp): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp.toDate());
}

interface NotificationItemProps {
  notification: TNotification;
  onMarkAsRead: (e: React.MouseEvent, notificationId: string) => void;
  /** Limita o corpo a 2 linhas (usado no dropdown). */
  clampBody?: boolean;
}

/**
 * Conteúdo de uma row de notificação (avatar, texto, data e botão de marcar como lida).
 * O container (DropdownMenuItem, div clicável...) é responsabilidade de quem consome.
 */
export function NotificationItem({ notification, onMarkAsRead, clampBody = false }: NotificationItemProps) {
  return (
    <>
      <Avatar className="h-9 w-9 shrink-0 border-2 border-sketch-border rounded-full">
        <AvatarImage src={notification.sender_info.profile_img} alt={notification.sender_info.name} />
        <AvatarFallback>
          <img src={defaultAvatarImgUrl} alt="avatar" width={36} height={36} />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <p
          className={cn(
            'font-sketch text-sm leading-snug text-title',
            clampBody && 'line-clamp-2',
            notification.is_read && 'opacity-60'
          )}
        >
          {notification.body}
        </p>
        <p className="font-sketch text-xs text-paragraph">
          {formatNotificationDate(notification.created_at)}
        </p>
      </div>
      {!notification.is_read && (
        <button
          type="button"
          aria-label="Marcar como lida"
          className="mt-0.5 shrink-0 text-success transition-all hover:text-sketch-fg active:scale-50 duration-200"
          onClick={(e) => onMarkAsRead(e, notification.id)}
        >
          <CheckCircle2 size={18} strokeWidth={2} aria-hidden />
        </button>
      )}
    </>
  );
}
