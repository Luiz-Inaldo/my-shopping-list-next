import { auth, db } from "@/lib/firebase";
import { TUserProfileProps } from "@/types/user";
import { TUserStoreProps } from "@/types/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
  const hasUserProfile = useGeneralUserStore.getState().userProfile;

  if (user && !hasUserProfile) {
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const profileData = snapshot.data() as TUserProfileProps;
        const authUserData = auth.currentUser;
        console.log("inserindo dados do usuário ao logar")
        console.log(authUserData);
        console.log("========================")
        useGeneralUserStore.getState().setUserProfile({
          ...profileData,
          email: authUserData?.email || "",
          emailVerified: authUserData?.emailVerified ?? false
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  }
});

export default useGeneralUserStore;
