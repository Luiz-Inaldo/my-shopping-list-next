import { auth, db } from "@/lib/firebase";
import { TUserProfileProps } from "@/types/user";
import { TUserStoreProps } from "@/types/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";

const useGeneralUserStore = create<TUserStoreProps>((set, get) => ({
  userProfile: null,
  setUserProfile: (userProfile: TUserProfileProps) => set({ userProfile }),

  // profile image
  removeProfileImageFromStoredUser: () => set({
    userProfile: {
      ...get().userProfile,
      profile_img: ""
    } as TUserProfileProps
  }),
  addProfileImageToStoredUser: (profile_img: string) => set({
    userProfile: {
      ...get().userProfile,
      profile_img
    } as TUserProfileProps
  }),

  // reset profile
  resetProfile: () => set({ userProfile: null }),
}));

let unsubscribeSnapshot: (() => void) | null = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("usuário logando:", user.uid);

    // Limpa o listener anterior se existir
    if (unsubscribeSnapshot) unsubscribeSnapshot();

    // Inicia o listener em tempo real para o perfil do usuário
    unsubscribeSnapshot = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (snapshot.exists() && !useGeneralUserStore.getState().userProfile) {
        const profileData = snapshot.data() as TUserProfileProps;
        const authUserData = auth.currentUser;
        console.log("profileData", profileData);
        useGeneralUserStore.getState().setUserProfile({
          ...profileData,
          email: authUserData?.email || "",
          emailVerified: authUserData?.emailVerified ?? false
        });
      }
    }, (error) => {
      console.error("Erro no listener de perfil:", error);
    });
  } else {
    console.log("usuário deslogando");
    // Limpa o listener ao deslogar
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }
    useGeneralUserStore.getState().resetProfile();
  }
});

export default useGeneralUserStore;
