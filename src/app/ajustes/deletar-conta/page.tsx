"use client";

import Header from "@/components/Header";
import { AppLoader } from "@/components/Loader/app-loader";
import ReauthenticateModal from "@/components/Modal/ReauthenticateModal";
import { Button } from "@/components/ui/button";
import { tryCatchRequest } from "@/functions/requests";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { APP_ROUTES } from "@/routes/app-routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, LoaderCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { deleteAccountSchema, type DeleteAccountInput } from "@/zodSchema/deleteAccount";
import { AnimatePresence, motion } from "motion/react";
import { LottieAnimation } from "@/components/Lottie/LottieAnimation";
import successAnimation from "@/animations/success.json";
import { cn } from "@/lib/utils";
import { deleteUserAccount, reautenticateUser } from "@/services/account";
import useGeneralUserStore from "@/store/generalUserStore";
import { LogOut } from "@/functions/logout";

type DeletingStatus = "idle" | "deleting" | "deleted"

export default function DeleteAccountPage() {

  const user = useGeneralUserStore(s => s.userProfile)
  const [deletingStatus, setDeletingStatus] = useState<DeletingStatus>("idle");
  const router = useRouter();

  const form = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  async function handleDeleteAccount(formData: DeleteAccountInput) {

    if (!user?.uid) return;

    // =================
    // Primero reautentica o usuário
    // =================
    
    const [_, err] = await tryCatchRequest(() => reautenticateUser(formData.password));

    if (err) {
      console.error(err.code);
      sendToastMessage({
        title: err.code,
        type: 'error'
      });
      return;
    }

    // ====================
    // após autenticação, inicia processo de delete
    // ====================

    setDeletingStatus("deleting");
    const userObj = {
      uid: user?.uid,
      username: user?.name
    }
    const [response, error] = await tryCatchRequest(() => deleteUserAccount(userObj));

    if (response) {
      setDeletingStatus("deleted");
    
      setTimeout(() => {
        LogOut();
      }, 3000);
    }
    if (error) {
      sendToastMessage({
        title: error.code || "Erro ao deletar conta",
        type: "error"
      });
      setDeletingStatus("idle");
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">

        {deletingStatus === "idle" && (
          <motion.div
            key="idle-container"
            className="w-full h-full"
            exit={{ opacity: 0, x: "-50%" }}
            transition={{ duration: 0.2 }}
          >
            <Header className="text-lg font-medium">
              <Link href={APP_ROUTES.private.settings.name} className="flex items-center gap-1 text-subtitle">
                <ChevronLeft size={20} />
              </Link>
              <span>Voltar para ajustes</span>
            </Header>

            <main
              className="main-container px-5 pb-6 pt-6 flex flex-col items-center justify-between"
            >
              <div
                className="flex flex-col items-center justify-start flex-1 gap-6"
              >
                {/* ... Conteúdo da imagem e lista ... */}
                <Image
                  src="/images/headache.svg"
                  alt="EzShoplist"
                  width={250}
                  height={250}
                />
                <div className="space-y-6">
                  <div className="space-y-2 text-center">
                    <h2 className="text-subtitle font-semibold text-xl">Que pena!</h2>
                    <p className="text-paragraph text-sm max-w-[350px]">
                      Lamentamos que você tenha tomado essa decisão. Você está prestes a <span className="text-destructive">deletar</span> sua conta. Saiba que essa ação é <span className="text-destructive">irreversível</span> e irá remover:
                    </p>
                  </div>
                  <ul className="list-disc list-inside text-paragraph text-sm max-w-80">
                    <li>Suas listas (incluindo as compartilhadas)</li>
                    <li>Seu histórico de compras</li>
                    <li>Seu perfil</li>
                  </ul>
                </div>
              </div>

              <ReauthenticateModal
                confirmButtonFn={() => form.handleSubmit(handleDeleteAccount)()}
                form={form}
                trigger={
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 size={18} />
                    Sim, deletar minha conta
                  </Button>
                }
              />
            </main>
          </motion.div>
        )}

        {deletingStatus !== "idle" && (
          <motion.main
            initial={{
              opacity: 0,
              x: "20%",
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: "50%",
            }}
            transition={{ duration: 0.2 }}
            className="min-h-screen flex flex-col items-center justify-between p-6"
          >
            <div className="flex flex-col gap-6 items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/images/cleaning-service.svg"
                  alt="Cleaning Service"
                  width={250}
                  height={250}
                />
              </motion.div>
              <div className="space-y-3 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-subtitle font-semibold text-2xl">
                  {deletingStatus === 'deleting' ? "Aguarde um momento" : "Tudo certo!"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="text-paragraph text-center text-sm max-w-72">
                  {deletingStatus === 'deleting' ? "Estamos limpando seus dados e removendo sua conta..." : "Você será redirecionado para a página de login em breve. Agradecemos por utilizar nosso app."}
                </motion.p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className={cn("flex items-center gap-1 transition-all duration-300 overflow-hidden",
                deletingStatus === 'deleting' ? 'max-w-[52px]' : 'max-w-[251px] justify-center'
              )}
            >
              {deletingStatus === "deleting" ?
                <AppLoader size={40} /> :
                <LottieAnimation
                  animationData={successAnimation}
                  width={50}
                  height={50}
                  loop={false}
                />
              }
              <p className="text-paragraph text-sm whitespace-nowrap">Conta deletada com sucesso!</p>
            </motion.div>
          </motion.main>
        )}

      </AnimatePresence>
    </>
  );
}

