"use client";
import { UserAvatar } from "@/components/UserAvatar";
import useGeneralUserStore from "@/store/generalUserStore";

export function ProfileCard() {
  const { userProfile } = useGeneralUserStore();

  return (
    <section className="flex items-center gap-4 px-2">
      <UserAvatar
        width={72}
        height={72}
      />
      <div className="flex flex-col justify-center">
        <h2 className="text-sketch-fg font-sketchHeading text-2xl leading-tight">
          {userProfile?.name}
        </h2>
        <p className="text-lg text-sketch-fg/60 font-sketch">{userProfile?.email || "—"}</p>
      </div>
    </section>
  );
}
