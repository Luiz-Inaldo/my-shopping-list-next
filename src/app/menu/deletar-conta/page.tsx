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
import { deleteAuthToken } from "@/functions/logout";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

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

    const [_, err] = await tryCatchRequest<boolean, FirebaseError>(reautenticateUser(formData.password));

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
    const [__, error] = await tryCatchRequest<void, FirebaseError>(deleteUserAccount(userObj));

    if (error) {
      sendToastMessage({
        title: error.code || "Erro ao deletar conta",
        type: "error"
      });
      setDeletingStatus("idle");
      return;
    }

    setDeletingStatus("deleted");

    setTimeout(async () => {
      await signOut(auth);
      await deleteAuthToken();
    }, 3000);
  }

  return (
    <>
      <AnimatePresence mode="wait">

        {deletingStatus === "idle" && (
          <motion.div
            key="idle-container"
            className="sketch-shell min-h-screen flex flex-col"
            exit={{ opacity: 0, x: "-50%" }}
            transition={{ duration: 0.2 }}
          >
            <Header className="text-2xl font-sketchHeading">
              <Link href={APP_ROUTES.private.menu.name} className="flex items-center gap-1 text-sketch-fg">
                <ChevronLeft size={24} strokeWidth={2.5} />
              </Link>
              <span>Menu</span>
            </Header>

            <main
              className="flex-1 px-5 pb-8 pt-8 flex flex-col items-center justify-between max-w-2xl mx-auto w-full"
            >
              <div
                className="flex flex-col items-center justify-start flex-1 gap-8"
              >
                <Image
                  src="/images/headache.svg"
                  alt="EzShoplist"
                  width={250}
                  height={250}
                  className="drop-shadow-sketch-sm"
                />
                <div className="space-y-6 text-sketch-fg">
                  <div className="space-y-2 text-center">
                    <h2 className="font-sketchHeading text-3xl">Que pena!</h2>
                    <p className="font-sketch text-lg leading-tight max-w-[350px]">
                      Lamentamos que você tenha tomado essa decisão. Você está prestes a <span className="text-sketch-danger font-bold underline">deletar</span> sua conta. Saiba que essa ação é <span className="text-sketch-danger font-bold">irreversível</span> e irá remover:
                    </p>
                  </div>
                  <ul className="space-y-2 font-sketch text-lg max-w-80">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-sketch-danger shrink-0" />
                      Suas listas (incluindo as compartilhadas)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-sketch-danger shrink-0" />
                      Seu histórico de compras
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-sketch-danger shrink-0" />
                      Seu perfil
                    </li>
                  </ul>
                </div>
              </div>

              <ReauthenticateModal
                confirmButtonFn={() => form.handleSubmit(handleDeleteAccount)()}
                form={form}
                trigger={
                  <div className="w-full mt-10">
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full h-12 text-lg px-6"
                    >
                      <Trash2 size={22} strokeWidth={2.5} />
                      Sim, deletar minha conta
                    </Button>
                  </div>
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
            className="sketch-shell min-h-screen flex flex-col items-center justify-between p-8"
          >
            <div className="flex flex-col gap-10 items-center justify-center flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/images/cleaning-service.svg"
                  alt="Cleaning Service"
                  width={280}
                  height={280}
                  className="drop-shadow-sketch"
                />
              </motion.div>
              <div className="space-y-4 text-center text-sketch-fg">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="font-sketchHeading text-4xl">
                  {deletingStatus === 'deleting' ? "Aguarde um momento" : "Tudo certo!"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="font-sketch text-xl max-w-sm leading-tight text-sketch-fg/60">
                  {deletingStatus === 'deleting' ? "Estamos limpando seus dados e removendo sua conta..." : "Você será redirecionado para a página de login em breve. Agradecemos por utilizar nosso app."}
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className={cn("flex items-center gap-3 transition-all duration-300 overflow-hidden bg-sketch-white border-[3px] border-sketch-border rounded-sketch-wobbly px-6 py-4 shadow-sketch",
                deletingStatus === 'deleting' ? 'max-w-fit' : 'max-w-md justify-center'
              )}
            >
              {deletingStatus === "deleting" ?
                <AppLoader size={32} /> :
                <LottieAnimation
                  animationData={successAnimation}
                  width={48}
                  height={48}
                  loop={false}
                />
              }
              <p className="font-sketch text-lg text-sketch-fg whitespace-nowrap">
                {deletingStatus === 'deleting' ? "Limpando tudo..." : "Conta deletada com sucesso!"}
              </p>
            </motion.div>
          </motion.main>
        )}

      </AnimatePresence>
    </>
  );
}

