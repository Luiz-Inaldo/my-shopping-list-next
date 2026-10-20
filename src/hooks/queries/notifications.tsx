import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import useGeneralUserStore from '@/store/generalUserStore';
import { getUnreadNotifications } from '@/services/notificationsServices';

export function useNotificationsQuery() {
  const userProfile = useGeneralUserStore((store) => store.userProfile);

  return useQuery({
    queryKey: [QUERY_KEYS.notifications, userProfile?.uid],
    queryFn: async () => {
      const { data } = await getUnreadNotifications(userProfile!.uid);
      return data;
    },
    enabled: !!userProfile?.uid,
  });
}
