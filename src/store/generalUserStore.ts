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

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("usuário logando:", user.uid);
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const profileData = snapshot.data() as TUserProfileProps;
        const authUserData = auth.currentUser;
        useGeneralUserStore.getState().setUserProfile({
          ...profileData,
          email: authUserData?.email || "",
          emailVerified: authUserData?.emailVerified ?? false
        });
      }
    }).catch((error) => {
      console.error("Erro ao buscar perfil:", error);
    });
  } else {
    console.log("usuário deslogando");
    useGeneralUserStore.getState().resetProfile();
  }
});

// snapshot para atualizar o perfil quando houver mudanças
onSnapshot(doc(db, "users", auth.currentUser?.uid || ""), (snapshot) => {
  if (snapshot.exists()) {
    const profileData = snapshot.data() as TUserProfileProps;
    const authUserData = auth.currentUser;
    useGeneralUserStore.getState().setUserProfile({
      ...profileData,
      email: authUserData?.email || "",
      emailVerified: authUserData?.emailVerified ?? false
    });
  }
});

export default useGeneralUserStore;
