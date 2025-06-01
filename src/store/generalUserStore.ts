import { TSupabaseUserInfo } from '@/types/supabase';
import { TUserStoreProps } from '@/types/userStore';
import {create} from 'zustand';

const useGeneralUserStore = create<TUserStoreProps>((set) => ({
    // user auth supabase
    user: null,
    setUser: (user: TSupabaseUserInfo) => set({ user }),

    // profile supabase
    userProfile: null,
    setUserProfile: (userProfile: any) => set({ userProfile }),
}));

export default useGeneralUserStore;
