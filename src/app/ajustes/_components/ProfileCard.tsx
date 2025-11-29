"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGeneralUserStore from "@/store/generalUserStore";
import { Pencil } from "lucide-react";
import Image from "next/image";

export function ProfileCard() {
  const { userProfile } = useGeneralUserStore();
  return (
    <section className="flex flex-col items-center gap-2">
      <div className="relative">
        <Avatar className="border-4 border-app-container size-24">
          <AvatarImage
            src={`https://api.dicebear.com/9.x/micah/svg?seed=${userProfile?.uid}`}
          />
          <AvatarFallback>
            <Image
              src="/images/avatars/default-avatar.svg"
              alt="no-profile-img"
              width={96}
              height={96}
            />
          </AvatarFallback>
        </Avatar>
        <button disabled className="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 rounded-full bg-default-green">
          <Pencil size={14} className="text-white" />
        </button>
      </div>
      <div className="flex flex-col items-center gap-0.5 mt-2">
        <p className="text-subtitle font-semibold text-lg">Luiz Inaldo</p>
        <p className="text-sm text-paragraph">luiz.inaldo970@gmail.com</p>
      </div>
    </section>
  );
}

