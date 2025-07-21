import { Check, X, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type ToastOptions = {
    title: string;
    description?: string;
    type: 'success' | 'error' | 'warning' | 'info';
    clickAction?: ((...args: any[]) => any) | ((...args: any[]) => Promise<any>);
}

const icons = {
    success: <Check className="text-green-400 text-lg" />,
    error: <X className="text-red-500 text-lg" />,
    warning: <AlertCircle className="text-amber-500 text-lg" />,
    info: <Info className="text-amber-500 text-lg" />,
}

export function sendToastMessage(toastOptions: ToastOptions) {
    return toast(toastOptions.title, {
        classNames: {
            toast: '!bg-black dark:!bg-snow !border-0',
            title: '!text-snow dark:!text-black',
            description: '!text-gray-400 dark:!text-gray-700',
            actionButton:
                'bg-snow dark:!bg-black dark:!text-snow transition-colors duration-300',
        },
        position: 'top-center',
        description: toastOptions.description || "",
        icon: icons[toastOptions.type],
        action: {
            label: 'OK',
            onClick() {
                toastOptions.clickAction?.() || toast.dismiss();
            },
        },
    });
}
