import { TNotificationProps } from '@/types/notifications';

export interface IUserNotificationService {
  getNotifications(userId: string): Promise<TNotificationProps[]>;
}