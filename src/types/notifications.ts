import { Timestamp } from "firebase/firestore";

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