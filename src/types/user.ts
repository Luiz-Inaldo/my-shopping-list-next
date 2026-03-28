import { Timestamp } from "firebase/firestore";

/**
 * ========================
 * # types from firebase
 * ========================
 */
export type TUserProfileProps = {
  premium: {
    status: boolean;
    expires_at: Timestamp | null;
  };
  uid: string;
  emailVerified: boolean;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
  profile_img: string;
};