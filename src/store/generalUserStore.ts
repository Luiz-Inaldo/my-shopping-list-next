import { auth, db } from "@/lib/firebase";
import { TUserProfileProps } from "@/types/user";
import { TUserStoreProps } from "@/types/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";

const useGeneralUserStore = create<TUserStoreProps>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile: TUserProfileProps) => set({ userProfile }),

  // reset profile
  resetProfile: () => set({ userProfile: null }),
}));

onAuthStateChanged(auth, (user) => {
  const hasUserProfile = useGeneralUserStore.getState().userProfile;

  if (user && !hasUserProfile) {
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data() as TUserProfileProps;
        useGeneralUserStore.getState().setUserProfile(userData);
      }
    });
  } else {
    console.error("Não existe sessão de usuário.");
  }
});

export default useGeneralUserStore;
