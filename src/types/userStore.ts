import { TUserProfileProps } from "./user";

export type TUserStoreProps = {
    userProfile: TUserProfileProps | null;
    setUserProfile: (userProfile: TUserProfileProps) => void;

    removeProfileImageFromStoredUser: () => void;
    addProfileImageToStoredUser: (profile_img: string) => void;

    // reset profile
    resetProfile: () => void;
}