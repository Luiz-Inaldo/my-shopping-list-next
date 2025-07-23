import OverlayEffect from "@/components/OverlayEffect";
import { sleep } from "@/functions/sleep";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type PageOverlayProps = {
    isChangingRoute: boolean,
    handleChangeRoute: (route: string) => void
}

const PageOverlayContext = createContext<PageOverlayProps | null>(null);

export const PageOverlayProvider = ({ children }: { children: React.ReactNode }) => {

    const [isChangingRoute, setIsChangingRoute] = useState<boolean>(false);
    const [currentRoute, setCurrentRoute] = useState<string>("");
    const router = useRouter();
    const pathname = usePathname();

    async function handleChangeRoute(route: string) {
        if (window.location.pathname === route) return;
        setIsChangingRoute(true);
        router.push(route);
    }

    useEffect(() => {
        async function changeRoute() {
            if (currentRoute !== pathname) {
                await sleep(0.5);
                setIsChangingRoute(false);
                setCurrentRoute(pathname);
            }
        }
        changeRoute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

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
