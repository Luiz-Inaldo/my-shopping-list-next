"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import useGeneralUserStore from "@/store/generalUserStore";
import { Pencil } from "lucide-react";
import Image from "next/image";

export function ProfileCard() {
  const { userProfile } = useGeneralUserStore();
  return (
    <section className="flex flex-col items-center gap-2">
      <div className="relative">
        <UserAvatar
          width={96}
          height={96}
          className='border-4 border-app-container'
        />
        <Button disabled className="absolute disabled:opacity-0 bottom-0 right-0 flex items-center justify-center w-7 h-7 rounded-full p-0">
          <Pencil size={14} className="text-white" />
        </Button>
      </div>
      <div className="flex flex-col items-center mt-2">
        <h2 className="text-subtitle font-semibold text-lg">{userProfile?.name}</h2>
        <p className="text-sm text-paragraph">{userProfile?.email || "—"}</p>
      </div>
    </section>
  );
}

