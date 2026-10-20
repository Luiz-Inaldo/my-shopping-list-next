import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from 'firebase/firestore';
import { TNotification } from '@/types/notifications';
import { sendToastMessage } from '@/functions/sendToastMessage';

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

export async function markNotificationAsRead(notificationId: string) {
  await updateDoc(doc(db, 'notifications', notificationId), { is_read: true });
}

/**
 * Escuta em tempo real apenas as notificações não lidas do usuário informado.
 * Por usar a query filtrada por `target_id`, notificações de outros usuários
 * nunca disparam o callback.
 */
export function subscribeToUnreadNotifications(
  userId: string,
  onData: (notifications: TNotification[], meta: { hasNew: boolean }) => void,
  onError?: (error: Error) => void
) {
  // o primeiro snapshot reporta todos os docs existentes como `added`
  let isFirstSnapshot = true;

  return onSnapshot(
    buildUnreadNotificationsQuery(userId),
    (snapshot) => {
      const hasNew =
        !isFirstSnapshot && snapshot.docChanges().some((change) => change.type === 'added');
      isFirstSnapshot = false;

      if (hasNew) {
        sendToastMessage({
          title: 'Nova notificação recebida!',
          type: 'info',
        });
      }
      onData(mapNotifications(snapshot.docs), { hasNew });
    },
    onError
  );
}
