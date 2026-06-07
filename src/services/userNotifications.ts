import { db } from '@/lib/firebase';
import { IUserNotificationService } from '@/interfaces/userNotificationService';
import { TNotificationProps } from '@/types/notifications';
import { collection, getDocs, orderBy, query, QueryConstraint, where } from 'firebase/firestore';

export class UserNotificationsService implements IUserNotificationService {
  async getNotifications({ userId, all = false }: { userId: string; all?: boolean }): Promise<TNotificationProps[]> {
    try {
      const notificationsRef = collection(db, 'notifications');
      const queryParts: QueryConstraint[] = [where('target_id', '==', userId)];

      if (!all) {
        queryParts.push(where('is_read', '==', false));
      }

      queryParts.push(orderBy('created_at', 'desc'));

      const notificationsQuery = query(notificationsRef, ...queryParts);

      const snapshot = await getDocs(notificationsQuery);

      return snapshot.docs.map((notificationDoc) => ({
        id: notificationDoc.id,
        ...(notificationDoc.data() as Omit<TNotificationProps, 'id'>),
      }));
    } catch (error) {
      console.error('Error fetching notifications for user:', error);
      return [];
    }
  }
}
