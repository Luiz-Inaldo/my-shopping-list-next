"use client";
import { UserAvatar } from "@/components/UserAvatar";
import useGeneralUserStore from "@/store/generalUserStore";

export function ProfileCard() {
  const { userProfile } = useGeneralUserStore();

  return (
    <section className="flex gap-2">
      <UserAvatar
        width={60}
        height={60}
        className="border-4 border-app-container"
      />
      <div className="flex flex-col justify-center">
        <h2 className="text-subtitle font-semibold text-lg">
          {userProfile?.name}
        </h2>
        <p className="text-sm text-paragraph">{userProfile?.email || "—"}</p>
      </div>
    </section>
  );
}
