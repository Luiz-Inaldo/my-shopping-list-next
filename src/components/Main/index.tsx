'use client'
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import { ProductsContext } from "@/context/ProductsContext";
import NonPurchaseList from "../NonPurchaseList";
import ShoppingList from "../ShoppingList";
import Header from "../Header";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ChevronRight, Menu, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/routes/app-routes";
import Image from "next/image";
import useGeneralUserStore from "@/store/generalUserStore";

const Main = () => {
  const {
    data,
    currentPurchase,
    loadingProducts
  } = useContext(ProductsContext);

  /**
   * ===========>> STORE <<============
   */
  const user = useGeneralUserStore(store => store.user)
  const userProfile = useGeneralUserStore(store => store.userProfile)

  return (
    <React.Fragment>
      <Header
        content={(_, visible) => (
          <>
            <div className='flex items-center gap-3 cursor-pointer overflow-hidden'>
              <Avatar className='border-2 border-title'>
                <AvatarImage src={userProfile?.profile_img} />
                <AvatarFallback>
                  <Image
                    src='/images/avatars/default-avatar.png'
                    alt='no-profile-img'
                    width={36}
                    height={36}
                  />
                </AvatarFallback>
              </Avatar>
              <div className='flex items-center'>
                <p className={`${visible ? "max-w-[89px] mr-1" : "max-w-0"} overflow-hidden whitespace-nowrap text-title transition-all duration-200`}>
                  Bem-vindo,
                </p>
                <p className='text-title'>{user?.user_metadata?.name || 'Usuário sem nome.'}</p>
                <ChevronRight size={16} className={`${visible ? "opacity-100 translate-x-0 ml-2" : "opacity-0 -translate-x-full"} transition-all duration-200 text-title`} />
              </div>
            </div>
            {currentPurchase ? (
              <Link href={APP_ROUTES.private.settings.name}>
                <SlidersHorizontal size={20} className='cursor-pointer text-title' />
              </Link>
            ) : (
              <Link href={APP_ROUTES.private.menu.name}>
                <Menu size={20} className='cursor-pointer text-title' />
              </Link>
            )}
          </>

        )}
      />
      <main
        className={`main-container py-28 px-5 flex flex-col gap-5`}
      >
        {loadingProducts ? (<p className="text-gray-800 dark:text-gray-100 font-medium text-xl text-center">Carregando lista...</p>) : (
          <>
            {(data?.length === 0 && !currentPurchase) ? (
              <NonPurchaseList />
            ) : (
              <ShoppingList listname={currentPurchase?.list_name} />
            )}
          </>
        )}
      </main>
    </React.Fragment>
  );
};

export default Main;
