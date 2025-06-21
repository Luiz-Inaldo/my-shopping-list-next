import { TSupabaseProfileInfo, TSupabaseUserInfo } from "./supabase"

export type TUserStoreProps = {
    // supabase auth user
    user: TSupabaseUserInfo | null;
    setUser: (user: TSupabaseUserInfo) => void;

    // profile supabase
    userProfile: TSupabaseProfileInfo | null;
    setUserProfile: (userProfile: TSupabaseProfileInfo) => void;
}