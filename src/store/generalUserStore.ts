import { auth } from '@/lib/firebase';
import { TSupabaseUserInfo } from '@/types/supabase';
import { TUserStoreProps } from '@/types/userStore';
import { onAuthStateChanged } from 'firebase/auth';
import {create} from 'zustand';

const useGeneralUserStore = create<TUserStoreProps>((set) => ({
    // user auth supabase
    user: null,
    setUser: (user: TSupabaseUserInfo) => set({ user }),

    // profile supabase
    userProfile: null,
    setUserProfile: (userProfile: any) => set({ userProfile }),

    // reset profile
    resetProfile: () => set({ userProfile: null, user: null })
}));

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuário logado:", user.uid);
  } else {
    console.log("Usuário não está logado");
  }
});

export default useGeneralUserStore;
