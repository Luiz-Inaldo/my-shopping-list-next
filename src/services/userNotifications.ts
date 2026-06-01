import { db } from '@/lib/firebase';
import { IUserNotificationService } from '@/interfaces/userNotificationService';
import { TNotificationProps } from '@/types/notifications';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

export class UserNotificationsService implements IUserNotificationService {
  async getNotifications(userId: string): Promise<TNotificationProps[]> {
    try {
      const notificationsRef = collection(db, 'notifications');
      const notificationsQuery = query(
        notificationsRef,
        where('target_id', '==', userId),
        where('is_read', '==', false),
        orderBy('created_at', 'desc')
      );

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
