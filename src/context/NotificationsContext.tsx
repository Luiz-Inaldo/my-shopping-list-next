'use client';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { db } from '@/lib/firebase';
import { UserNotificationsService } from '@/services/userNotifications';
import useGeneralUserStore from '@/store/generalUserStore';
import { TNotificationProps } from '@/types/notifications';
import { queryClient } from '@/utils/queryClient';
import { useQuery } from '@tanstack/react-query';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

type NotificationsContextType = {
  notifications: TNotificationProps[];
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const userNotificationsService = new UserNotificationsService();

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const userProfile = useGeneralUserStore((store) => store.userProfile);
  const userId = userProfile?.uid;

  const { data: notifications = [] } = useQuery<TNotificationProps[]>({
    queryKey: [QUERY_KEYS.userNotifications, userId],
    queryFn: () => userNotificationsService.getNotifications(userId as string),
    enabled: !!userId,
  });

  // useEffect(() => {
  //   if (!userId) return;

  //   const notificationsRef = collection(db, 'notifications');
  //   const notificationsQuery = query(
  //     notificationsRef,
  //     where('target_id', '==', userId),
  //     where('is_read', '==', false),
  //     orderBy('created_at', 'desc')
  //   );

  //   const unsubscribe = onSnapshot(notificationsQuery, () => {
  //     queryClient.invalidateQueries({
  //       queryKey: [QUERY_KEYS.userNotifications, userId],
  //     });
  //   });

  //   return () => unsubscribe();
  // }, [userId]);

  const value = useMemo(
    () => ({ notifications }),
    [notifications]
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