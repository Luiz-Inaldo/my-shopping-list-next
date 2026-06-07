import { TNotificationProps } from '@/types/notifications';

export interface IUserNotificationService {
  getNotifications(params: { userId: string; all?: boolean }): Promise<TNotificationProps[]>;
}
