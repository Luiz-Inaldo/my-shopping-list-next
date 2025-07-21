import OverlayEffect from "@/components/OverlayEffect";
import { sleep } from "@/functions/sleep";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

type PageOverlayProps = {
    isChangingRoute: boolean,
    handleChangeRoute: (route: string) => void
}

const PageOverlayContext = createContext<PageOverlayProps | null>(null);

export const PageOverlayProvider = ({ children }: { children: React.ReactNode }) => {

    const [isChangingRoute, setIsChangingRoute] = useState<boolean>(false);
    const router = useRouter();

    async function handleChangeRoute(route: string) {
        if (window.location.pathname === route) return;
        setIsChangingRoute(true);
        await sleep(0.3)
        router.push(route);
        await sleep(1)
        setIsChangingRoute(false);
    }

    return (
        <PageOverlayContext.Provider value={{ isChangingRoute, handleChangeRoute }}>
            {children}
            <OverlayEffect isChangingRoute={isChangingRoute} />
        </PageOverlayContext.Provider>
    )
};

export const usePageOverlay = () => {
    const context = useContext(PageOverlayContext);
    if (!context) {
        throw new Error("usePageOverlay must be used within a PageOverlayProvider");
    }
    return context;
}
