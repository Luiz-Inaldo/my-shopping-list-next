import {
  ErrorToast,
  InfoToast,
  LoadingToast,
  SuccessToast,
  WarningToast,
} from '@/components/Toast';
import { toast } from 'sonner';

const TOAST_DURATION = 5_000;

export const TOAST_LOADING_ID = 'app-toast-loading';

type ToastOptions = {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'loading' | 'info';
  actionlabel?: string;
  previousToastId?: string | number;
  clickAction?: ((...args: unknown[]) => unknown) | ((...args: unknown[]) => Promise<unknown>);
};

const toastBase =
  'rounded-sketch-notif !border-2 !border-sketch-border p-0 overflow-hidden';

export function sendToastMessage(toastOptions: ToastOptions) {
  const toastType = toastOptions.type;
  const previousToastId = toastOptions.previousToastId;

  if (previousToastId) {
    toast.dismiss(previousToastId);
  }

  const commonOptions = {
    duration: toastType === 'loading' ? Infinity : TOAST_DURATION,
    position: 'top-center' as const,
    ...(toastOptions.actionlabel && {
      action: {
        label: toastOptions.actionlabel,
        onClick() {
          toastOptions.clickAction?.() ?? toast.dismiss(TOAST_LOADING_ID);
        },
      },
    }),
  };

  switch (toastType) {
    case 'success':
      return toast(
        <SuccessToast title={toastOptions.title} description={toastOptions.description} />,
        {
          ...commonOptions,
          classNames: {
            toast: `${toastBase} !rounded-sketch-card p-0 !bg-sketch-success`,
          },
        }
      );
    case 'error':
      return toast(
        <ErrorToast title={toastOptions.title} description={toastOptions.description} />,
        {
          ...commonOptions,
          classNames: {
            toast: `${toastBase} !border-sketch-danger !bg-sketch-danger-lt`,
          },
        }
      );
    case 'warning':
      return toast(
        <WarningToast title={toastOptions.title} description={toastOptions.description} />,
        {
          ...commonOptions,
          classNames: {
            toast: `${toastBase} !border-[#f59e0b] !bg-[#fef9c3]`,
          },
        }
      );
    case 'loading':
      return toast(
        <LoadingToast title={toastOptions.title} description={toastOptions.description} />,
        {
          id: TOAST_LOADING_ID,
          ...commonOptions,
          classNames: {
            toast: `${toastBase} !border-[#2d2d2d] !bg-[#2d2d2d]`,
          },
        }
      );
    case 'info':
      return toast(
        <InfoToast title={toastOptions.title} description={toastOptions.description} />,
        {
          ...commonOptions,
          classNames: {
            toast: `${toastBase} !border-[#2d5da1] !bg-[#dbeafe]`,
          },
        }
      );
    default:
      break;
  }
}