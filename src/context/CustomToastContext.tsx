import { AppLoader } from "@/components/Loader/app-loader";
import { LottieAnimation } from "@/components/Lottie/LottieAnimation";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useRef, useState, useCallback, useMemo } from "react";
import sucessAnimation from "../../src/animations/success.json";
import errorAnimation from "../../src/animations/error.json";

enum STATUS {
    LOADING = "loading",
    SUCCESS = "success",
    ERROR = "error",
    HIDDEN = "hidden",
};

type TCustomProps = {
    status: STATUS;
    message: string;
    visible: boolean;
};

type CustomToastContext = {
    customToast: {
        loading: (message?: string) => void;
        success: (msg: string, opts?: {
            autohide: number;
        }) => void;
        error: (msg: string, opts?: {
            autohide: number;
        }) => void;
        hide: (delay?: number) => void
    };
};

const ToastContext = createContext<CustomToastContext | null>(null);

function Toast({ status, message, visible }: TCustomProps) {

    function renderIconByStatus() {
        switch (status) {
            case STATUS.LOADING:
                return <AppLoader size={36} />;
            case STATUS.SUCCESS:
                return <LottieAnimation
                    animationData={sucessAnimation}
                    loop={false}
                    width={48}
                    height={48}
                />;
            case STATUS.ERROR:
                return <LottieAnimation
                    animationData={errorAnimation}
                    loop={false}
                    width={48}
                    height={48}
                />;
            default:
                return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm p-6">
            <AnimatePresence mode="wait">
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, y: "-125%", scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: "-125%", scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-app-primary"
                    >
                        <div className="flex items-center justify-center basis-10">
                            {renderIconByStatus()}
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium text-snow">
                                {status === STATUS.LOADING ? "Aguarde" : status === STATUS.SUCCESS ? "Sucesso" : "Erro"}
                            </h3>
                            <p className="text-gray-400 text-sm">{message}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function CustomToastProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState({ status: STATUS.HIDDEN, message: "", visible: false });
    const hideTimer = useRef<NodeJS.Timeout | undefined>(undefined);

    const clearTimers = () => clearTimeout(hideTimer.current);

    // Abre o toast com qualquer status e mensagem
    const show = useCallback((status: STATUS, message: string) => {
        clearTimers();
        setState({ status, message, visible: true });
    }, []);

    // Fecha o toast (com animação de saída)
    const hide = useCallback((delay = 0) => {
        clearTimers();
        hideTimer.current = setTimeout(() => {
            setState((prev) => ({ ...prev, visible: false }));
            // Remove do DOM após a animação
            setTimeout(() => setState({ status: STATUS.HIDDEN, message: "", visible: false }), 300);
        }, delay);
    }, []);

    const customToast = useMemo(() => {
        return {
            loading: (message = "Carregando...") => {
                show(STATUS.LOADING, message);
            },
            success: (msg: string, opts: { autohide: number } = { autohide: 2500 }) => {
                show(STATUS.SUCCESS, msg); if (opts.autohide) hide(opts.autohide);
            },
            error: (msg: string, opts: { autohide: number } = { autohide: 3000 }) => {
                show(STATUS.ERROR, msg); if (opts.autohide) hide(opts.autohide);
            },
            hide: (delay = 0) => {
                hide(delay);
            }
        }
    }, []);

    const isOpen = state.status !== STATUS.HIDDEN;

    return (
        <ToastContext.Provider value={{ customToast }}>
            {children}
            {isOpen && <Toast status={state.status} message={state.message} visible={state.visible} />}
        </ToastContext.Provider>
    );
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────
export function useCustomToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useCustomToast deve ser usado dentro de <ToastProvider>");
    return ctx;
}