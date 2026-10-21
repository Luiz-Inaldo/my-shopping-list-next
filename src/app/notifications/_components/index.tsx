"use client";
import Header from '@/components/Header';
import { NotificationItem } from '@/components/Notifications/NotificationItem';
import { useNotificationsContext } from '@/context/NotificationsContext';
import { cn } from '@/lib/utils';
import { APP_ROUTES } from '@/routes/app-routes';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function NotificationsPage() {
    const router = useRouter();
    const { queryData, markAsRead } = useNotificationsContext();
    const { data: notifications, isLoading, isError, refetch } = queryData;

    function handleMarkAsRead(e: React.MouseEvent, notificationId: string) {
        e.stopPropagation();
        markAsRead(notificationId);
    }

    function renderContent() {
        if (isLoading) {
            return (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-sketch-notif border-2 border-sketch-border opacity-40" />
                    ))}
                </div>
            );
        }

        if (isError) {
            return (
                <div className="py-10 text-center font-sketch text-paragraph">
                    <p>Erro ao carregar notificações.</p>
                    <button type="button" onClick={() => refetch()} className="mt-2 text-sketch-accent hover:underline">
                        Tentar novamente
                    </button>
                </div>
            );
        }

        if (notifications?.length === 0 && !isLoading) {
            return <p className="py-10 text-center font-sketch text-sm text-paragraph">Nenhuma notificação</p>;
        }

        return (
            <ul className="flex flex-col gap-3">
                {notifications?.map((notification) => (
                    <li key={notification.id}>
                        <div
                            role="link"
                            tabIndex={0}
                            bg-sketch-accent-lt
                            className={cn("flex cursor-pointer items-start gap-3 rounded-sketch-notif border-2 border-sketch-border shadow-sketch-2 px-3 py-3",
                                !notification.is_read && "bg-sketch-accent-lt"
                            )}
                            onClick={() => router.push(APP_ROUTES.private.shoppingList.name(notification.metadata.purchase_id as string))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') router.push(APP_ROUTES.private.shoppingList.name(notification.metadata.purchase_id as string));
                            }}
                        >
                            <NotificationItem notification={notification} onMarkAsRead={handleMarkAsRead} />
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className="flex flex-col h-dvh overflow-hidden">
            <Header className="text-lg font-medium shrink-0">
                <Link href={APP_ROUTES.private.home.name} aria-label="Voltar" className="flex items-center text-sketch-fg">
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </Link>
                <span>Notificações</span>
            </Header>

            <div className="flex-1 overflow-y-auto px-5 py-6">{renderContent()}</div>
        </div>
    );
}
