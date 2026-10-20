import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import useGeneralUserStore from '@/store/generalUserStore';
import {
  getUnreadNotifications,
  subscribeToUnreadNotifications,
} from '@/services/notificationsServices';
import { queryClient } from '@/utils/queryClient';

export function useNotificationsQuery() {
  const userProfile = useGeneralUserStore((store) => store.userProfile);
  const uid = userProfile?.uid;

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = subscribeToUnreadNotifications(
      uid,
      (data) => queryClient.setQueryData([QUERY_KEYS.notifications, uid], data),
      (error) => console.error(error)
    );
    return () => unsubscribe();
  }, [uid, queryClient]);

  return useQuery({
    queryKey: [QUERY_KEYS.notifications, uid],
    queryFn: async () => {
      const { data } = await getUnreadNotifications(uid!);
      return data;
    },
    enabled: !!uid,
    staleTime: Infinity,
  });
}
