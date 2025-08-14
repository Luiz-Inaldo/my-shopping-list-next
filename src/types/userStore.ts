import { TSupabaseUserInfo } from "./supabase"
import { TUserProfileProps } from "./user";

export type TUserStoreProps = {
    userProfile: TUserProfileProps | null;
    setUserProfile: (userProfile: TUserProfileProps) => void;

    // reset profile
    resetProfile: () => void;
}