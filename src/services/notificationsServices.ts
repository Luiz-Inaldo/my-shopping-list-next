import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { TNotification } from '@/types/notifications';

export async function getUnreadNotifications(userId: string) {
  const q = query(
    collection(db, 'notifications'),
    where('target_id', '==', userId),
    where('is_read', '==', false),
    orderBy('created_at', 'desc'),
    limit(3)
  );
  const result = await getDocs(q);
  const data: TNotification[] = result.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TNotification[];
  return { data };
}
