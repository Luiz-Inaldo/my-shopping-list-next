import { Timestamp } from 'firebase/firestore';

export type NotificationType = 'default' | 'success' | 'warning' | 'error' | 'listInvitation';
export type NotificationStatus = 'pending' | 'accepted' | 'rejected';

export type TNotificationProps = {
  id: string;
  body: string;
  status: NotificationStatus;
  created_at: Timestamp;
  is_read: boolean;
  sender_id: string;
  target_id: string;
  type: NotificationType;
  metadata?: Record<string, any>;
};