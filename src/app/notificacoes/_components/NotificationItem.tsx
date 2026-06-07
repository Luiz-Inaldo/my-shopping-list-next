'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { defaultAvatarImgUrl } from '@/constants/avatarImgUrl';
import { getInitials } from '@/functions/getInitials';
import { formatNotificationDateTime } from '@/functions/formatNotificationDateTime';
import { cn } from '@/lib/utils';
import { NotificationStatus, NotificationType, TNotificationProps } from '@/types/notifications';

type NotificationItemProps = {
  notification: TNotificationProps;
  onMarkAsRead: (id: string) => void;
  onUpdateInvitation: (id: string, status: Extract<NotificationStatus, 'accepted' | 'rejected'>) => void;
};

const notificationTypeLabel: Record<NotificationType, string> = {
  default: 'Notificação',
  success: 'Atualização',
  warning: 'Aviso',
  error: 'Erro',
  listInvitation: 'Convite para lista',
};

export function NotificationItem({ notification, onMarkAsRead, onUpdateInvitation }: NotificationItemProps) {
  const isInvitation = notification.type === 'listInvitation';
  const isPendingInvitation = isInvitation && notification.status === 'pending';
  const senderName = notification.sender_info.name;
  const senderAvatar = notification.sender_info.profile_url || defaultAvatarImgUrl;

  return (
    <Card className={cn('overflow-hidden transition-all', notification.is_read && 'opacity-75')}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-4">
          <Avatar className="size-8 shrink-0 border-2 border-sketch-border shadow-sketch-sm rounded-sketch-avatar">
            <AvatarImage src={senderAvatar} alt={senderName} />
            <AvatarFallback className="bg-sketch-accent-lt text-sketch-accent-dk font-sketchHeading text-sm">
              {getInitials(senderName) || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold leading-tight text-sketch-fg">
                  {notificationTypeLabel[notification.type]}
                </h3>
                {notification.is_read && (
                  <span className="rounded-sketch-section-label border-2 border-sketch-border bg-sketch-muted px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-sketch-fg">
                    Lida
                  </span>
                )}
                {isInvitation && notification.status !== 'pending' && (
                  <span
                    className={cn(
                      'rounded-sketch-section-label border-2 border-sketch-border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                      notification.status === 'accepted'
                        ? 'bg-sketch-success text-white'
                        : 'bg-sketch-danger text-white',
                    )}
                  >
                    {notification.status === 'accepted' ? 'Aceita' : 'Recusada'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-paragraph/80">
                <span>Por {senderName}</span>
                <span>•</span>
                <span>{formatNotificationDateTime(notification.created_at)}</span>
              </div>
            </div>

            <p className="font-sketch p-2 border border-sketch-border rounded-sketch-btn bg-sketch-bg text-sm leading-relaxed text-subtitle">
              {notification.body}
            </p>

            <div className="flex flex-wrap gap-2 items-end justify-end pt-1">
              {isPendingInvitation ? (
                <>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => onUpdateInvitation(notification.id, 'accepted')}
                  >
                    Aceitar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateInvitation(notification.id, 'rejected')}
                  >
                    Recusar
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  disabled={notification.is_read}
                >
                  {notification.is_read ? 'Lida' : 'Marcar como lida'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}