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
import { APP_ROUTES } from "@/routes/app-routes";
import Image from "next/image";
import useGeneralUserStore from "@/store/generalUserStore";
import { usePageOverlay } from "@/context/PageOverlayContext";
import PurchaseSaved from "../ShoppingList/PurchaseSaved";

const Main = () => {
  const {
    data,
    currentPurchase,
    loadingProducts
  } = useContext(ProductsContext);

  /**
   * ===========>> STORE <<============
   */
  const userProfile = useGeneralUserStore(store => store.userProfile);

  /**
   * ===========>> STATES <<============
   */
  const [showConcludedDisplay, setShowConcludedDisplay] = useState<boolean>(false);

  /**
   * ==========>> CONTEXT <<============
   */
  const { handleChangeRoute } = usePageOverlay();

  if (showConcludedDisplay) {
    return (
      <PurchaseSaved
        close={() => setShowConcludedDisplay(false)}
      />
    )
  }

  return (
    <React.Fragment>
      <Header
        content={(_, visible) => (
          <>
            <div className='flex items-center gap-3 cursor-pointer overflow-hidden'>
              <Avatar className='border-2 border-app-container'>
                <AvatarImage src={userProfile?.profile_img} />
                <AvatarFallback>
                  <Image
                    src='/images/avatars/default-avatar.svg'
                    alt='no-profile-img'
                    width={28}
                    height={28}
                  />
                </AvatarFallback>
              </Avatar>
              <div className='flex items-center'>
                <p className={`${visible ? "max-w-[89px] mr-1" : "max-w-0"} overflow-hidden whitespace-nowrap text-title transition-all duration-200`}>
                  Bem-vindo,
                </p>
                <p className='text-title'>{userProfile?.user_name || 'Usuário sem nome.'}</p>
                <ChevronRight size={16} className={`${visible ? "opacity-100 translate-x-0 ml-2" : "opacity-0 -translate-x-full"} transition-all duration-200 text-title`} />
              </div>
            </div>
            {currentPurchase ? (
              <div onClick={() => handleChangeRoute(APP_ROUTES.private.settings.name)}>
                <SlidersHorizontal size={20} className='cursor-pointer text-title' />
              </div>
            ) : (
              <div onClick={() => handleChangeRoute(APP_ROUTES.private.menu.name)}>
                <Menu size={20} className='cursor-pointer text-title' />
              </div>
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
              <ShoppingList
                listname={currentPurchase?.list_name}
                showConcludedDisplay={showConcludedDisplay}
                setShowConcludedDisplay={setShowConcludedDisplay}
              />
            )}
          </>
        )}
      </main>
    </React.Fragment>
  );
};

export default Main;
