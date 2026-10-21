import { Timestamp } from "firebase/firestore";
import { UseQueryResult } from "@tanstack/react-query";

export type TNotification = {
    id: string;
    body: string;
    created_at: Timestamp;
    is_read: boolean;
    metadata: Record<string, unknown>;
    sender_info: {
        id: string;
        name: string;
        profile_img: string;
    };
    target_id: string;
    title: string;
}

export interface INotificationsContextProps {
    queryData: UseQueryResult<TNotification[], Error>;
    markAsRead: (notificationId: string) => Promise<void>;
}
