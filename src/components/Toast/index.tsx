'use client';

import { LottieAnimation } from '@/components/Lottie/LottieAnimation';
import { ArrowDown, ArrowUp, LoaderCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import NumberFlow from '@number-flow/react';

import { cn } from '@/lib/utils';

interface ToastValueOptions {
  changeValueVariant: 'up' | 'down';
  currentTotal: number;
  totalValue: number;
}

interface ToastProps {
  title: string;
  description?: string;
  options?: ToastValueOptions;
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
  options,
  titleClassName,
  descriptionClassName,
}: ToastLayoutProps) {
  const [animatedValue, setAnimatedValue] = useState(options?.currentTotal ?? 0);

  useEffect(() => {
    if (options) {
      const timeout = setTimeout(() => {
        setAnimatedValue(options.totalValue);
      }, 750);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        'flex gap-3 p-0',
        description || options ? 'items-start' : 'items-center'
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
        {options && (
          <div className="mt-1 flex w-full items-center justify-between">
            <div className={cn('flex items-center gap-1 font-sketch text-[12px]', descriptionClassName)}>
              {options.changeValueVariant === 'up'
                ? <ArrowUp size={12} strokeWidth={2.5} />
                : <ArrowDown size={12} strokeWidth={2.5} />}
              <span>Valor total da lista:</span>
            </div>
            <span className={cn('font-sketch text-[14px] ml-20 font-bold', descriptionClassName)}>
              R$<NumberFlow
                value={animatedValue}
                format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadingToast({ title, description, options }: ToastProps) {
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
      options={options}
      titleClassName="text-sketch-white"
      descriptionClassName="text-sketch-white/80"
    />
  );
}

export function SuccessToast({ title, description, options }: ToastProps) {
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
      options={options}
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