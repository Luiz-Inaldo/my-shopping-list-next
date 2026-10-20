import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import useGeneralUserStore from '@/store/generalUserStore';
import {
  getUnreadNotifications,
  subscribeToUnreadNotifications,
} from '@/services/notificationsServices';
import { queryClient } from '@/utils/queryClient';
import { sendToastMessage } from '@/functions/sendToastMessage';

export function useNotificationsQuery() {
  const userProfile = useGeneralUserStore((store) => store.userProfile);
  const uid = userProfile?.uid;
  const [newNotificationSignal, setNewNotificationSignal] = useState(0);

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = subscribeToUnreadNotifications(
      uid,
      (data, { hasNew }) => {
        queryClient.setQueryData([QUERY_KEYS.notifications, uid], data);
        if (hasNew) setNewNotificationSignal((n) => n + 1);
      },
      (error) => console.error(error)
    );
    return () => unsubscribe();
  }, [uid, queryClient]);

  const query = useQuery({
    queryKey: [QUERY_KEYS.notifications, uid],
    queryFn: async () => {
      const { data } = await getUnreadNotifications(uid!);
      return data;
    },
    enabled: !!uid,
    staleTime: Infinity,
  });

  return { ...query, newNotificationSignal };
}
