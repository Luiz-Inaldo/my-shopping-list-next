import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import { TNotification } from '@/types/notifications';

function buildUnreadNotificationsQuery(userId: string) {
  return query(
    collection(db, 'notifications'),
    where('target_id', '==', userId),
    where('is_read', '==', false),
    orderBy('created_at', 'desc'),
    limit(3)
  );
}

function mapNotifications(docs: QueryDocumentSnapshot[]): TNotification[] {
  return docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TNotification[];
}

export async function getUnreadNotifications(userId: string) {
  const result = await getDocs(buildUnreadNotificationsQuery(userId));
  const data = mapNotifications(result.docs);
  return { data };
}

/**
 * Escuta em tempo real apenas as notificações não lidas do usuário informado.
 * Por usar a query filtrada por `target_id`, notificações de outros usuários
 * nunca disparam o callback.
 */
export function subscribeToUnreadNotifications(
  userId: string,
  onData: (notifications: TNotification[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    buildUnreadNotificationsQuery(userId),
    (snapshot) => onData(mapNotifications(snapshot.docs)),
    onError
  );
}
