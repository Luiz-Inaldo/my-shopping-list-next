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
    <section className="flex flex-col items-center gap-2">
      <div className="relative">
        <UserAvatar
          width={96}
          height={96}
          className='border-4 border-app-container'
        />

        {/* <label className="absolute bg-app-primary bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full p-0 transition-transform active:scale-90">
          <input
            type="file"
            name="profile-img"
            id="profile-img"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleOpenModal(e)}
          />
          <Pencil size={14} className="text-white" />
        </label> */}

        <ProfileCardDropdown
          onAlterPhoto={(img) => handleOpenModal(img)}
          onRemovePhoto={handleRemoveImage}
        >
          <Button
            className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full p-0 shadow-lg border-2 border-app-container transition-transform active:scale-90"
          >
            <EllipsisVertical size={14} className="text-white" />
          </Button>
        </ProfileCardDropdown>
      </div>
      <div className="flex flex-col items-center mt-2">
        <h2 className="text-subtitle font-semibold text-lg">{userProfile?.name}</h2>
        <p className="text-sm text-paragraph">{userProfile?.email || "—"}</p>
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

