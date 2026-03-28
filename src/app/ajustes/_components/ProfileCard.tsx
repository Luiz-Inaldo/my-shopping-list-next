"use client";
import { Activity, useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import useGeneralUserStore from "@/store/generalUserStore";
import { EllipsisVertical, Pencil } from "lucide-react";
import { ProfileCardDropdown } from "@/components/Dropdown/ProfileCardDropdown";
import { removeProfileImage } from "@/services/account";
import { tryCatchRequest } from "@/functions/requests";
import { sendToastMessage } from "@/functions/sendToastMessage";

const ProfileImgChangerModal = lazy(() => import("@/components/Modal/ProfileImgChangerModal"));

/**
 * Componente de cartão de perfil que exibe o avatar e informações do usuário,
 * integrando o dropdown e o modal para alteração da foto.
 */
export function ProfileCard() {
  const { userProfile, removeProfileImageFromStoredUser } = useGeneralUserStore();
  const [img, setImg] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpenModal(img: File) {
    setImg(img)
    setIsModalOpen(true)
  }

  async function handleRemoveImage() {
    if (!userProfile?.uid) return;
    const [_, error] = await tryCatchRequest<void, Error>(removeProfileImage(userProfile?.uid))
    if (error) {
      console.log(error);
      sendToastMessage({
        type: 'error',
        title: 'Erro ao remover imagem',
      })
      return;
    };
    removeProfileImageFromStoredUser();
    sendToastMessage({
      type: 'success',
      title: 'Imagem removida',
    })
    setIsModalOpen(false)
  }

  return (
    <section className="flex flex-col items-center gap-4 py-4 font-sketch">
      <div className="relative rotate-1">
        <UserAvatar
          width={110}
          height={110}
          className='border-[3px] border-sketch-fg rounded-sketch-avatar shadow-sketch-sm'
        />

        <ProfileCardDropdown
          onAlterPhoto={(img) => handleOpenModal(img)}
          onRemovePhoto={handleRemoveImage}
        >
          <Button
            className="absolute -bottom-1 -right-1 !rounded-sketch-avatar"
            size="icon"
          >
            <EllipsisVertical size={18} strokeWidth={2.5} />
          </Button>
        </ProfileCardDropdown>
      </div>
      <div className="flex flex-col items-center mt-2 -rotate-1">
        <h2 className="text-sketch-fg font-sketchHeading text-3xl">{userProfile?.name}</h2>
        <p className="text-lg text-sketch-fg/70 font-sketch underline decoration-sketch-accent/30 underline-offset-4">{userProfile?.email || "—"}</p>
      </div>

      <Suspense fallback={null}>
        <Activity mode={isModalOpen ? 'visible' : 'hidden'}>
          <ProfileImgChangerModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            file={img}
            onChangePhoto={() => console.log('Alterar foto')}
            onRemovePhoto={() => console.log('Remover foto')}
          />
        </Activity>
      </Suspense>
    </section>
  );
}

