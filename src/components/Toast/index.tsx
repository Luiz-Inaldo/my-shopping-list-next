'use client';

import { LottieAnimation } from '@/components/Lottie/LottieAnimation';
import { LoaderCircle } from 'lucide-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';

interface ToastProps {
  title: string;
  description?: string;
}

interface ToastLayoutProps extends ToastProps {
  icon: React.ReactNode;
  titleClassName: string;
  descriptionClassName: string;
}

function ToastLayout({
  icon,
  title,
  description,
  titleClassName,
  descriptionClassName,
}: ToastLayoutProps) {
  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-3',
        description ? 'items-start' : 'items-center'
      )}
    >
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className={cn('font-sketch text-[13px] font-bold', titleClassName)}>
          {title}
        </p>
        {description && (
          <p className={cn('mt-1 font-sketch text-[12px]', descriptionClassName)}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function LoadingToast({ title, description }: ToastProps) {
  return (
    <ToastLayout
      icon={
        <LoaderCircle
          className="size-5 animate-spin text-sketch-white"
          strokeWidth={2.5}
        />
      }
      title={title}
      description={description}
      titleClassName="text-sketch-white"
      descriptionClassName="text-sketch-white/80"
    />
  );
}

export function SuccessToast({ title, description }: ToastProps) {
  const checkAnimation = useMemo(
    () => require('@/animations/success.json'),
    []
  );

  return (
    <ToastLayout
      icon={
        <LottieAnimation
          animationData={checkAnimation}
          width={32}
          height={32}
          loop={false}
        />
      }
      title={title}
      description={description}
      titleClassName="font-normal text-sketch-white"
      descriptionClassName="font-normal text-sketch-white/80"
    />
  );
}

export function ErrorToast({ title, description }: ToastProps) {
  const errorAnimation = useMemo(
    () => require('@/animations/error.json'),
    []
  );

  return (
    <ToastLayout
      icon={
        <LottieAnimation
          animationData={errorAnimation}
          width={28}
          height={28}
          loop={false}
        />
      }
      title={title}
      description={description}
      titleClassName="text-sketch-danger"
      descriptionClassName="text-sketch-danger/90"
    />
  );
}

export function WarningToast({ title, description }: ToastProps) {
  const warningAnimation = useMemo(
    () => require('@/animations/warning.json'),
    []
  );

  return (
    <ToastLayout
      icon={
        <LottieAnimation
          animationData={warningAnimation}
          width={28}
          height={28}
          loop={false}
        />
      }
      title={title}
      description={description}
      titleClassName="text-[#92400e]"
      descriptionClassName="text-[#b45309]"
    />
  );
}

export function InfoToast({ title, description }: ToastProps) {
  const infoAnimation = useMemo(
    () => require('@/animations/info.json'),
    []
  );

  return (
    <ToastLayout
      icon={
        <LottieAnimation
          animationData={infoAnimation}
          width={28}
          height={28}
          loop={false}
        />
      }
      title={title}
      description={description}
      titleClassName="text-[#1e40af]"
      descriptionClassName="text-[#2563eb]"
    />
  );
}