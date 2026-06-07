'use client';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { UserNotificationsService } from '@/services/userNotifications';
import useGeneralUserStore from '@/store/generalUserStore';
import { TNotificationProps } from '@/types/notifications';
import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useMemo } from 'react';

type NotificationsContextType = {
  notifications: TNotificationProps[] | undefined;
  isLoading: boolean;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const userNotificationsService = new UserNotificationsService();

export function NotificationsProvider({ children, all = false }: { children: ReactNode; all?: boolean }) {
  const userProfile = useGeneralUserStore((store) => store.userProfile);
  const userId = userProfile?.uid;

  const { data: notifications, isLoading } = useQuery<TNotificationProps[]>({
    queryKey: [QUERY_KEYS.userNotifications, userId, all],
    queryFn: () => userNotificationsService.getNotifications({ userId: userId as string, all }),
    enabled: !!userId,
  });

  const value = useMemo(
    () => ({ notifications, isLoading }),
    [isLoading, notifications]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }

  return context;
}