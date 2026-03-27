'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Lottie from 'lottie-react';
import { AppLoader } from '@/components/Loader/app-loader';
import successAnim from '@/animations/success.json';
import errorAnim from '@/animations/error.json';
import { Button } from '@/components/ui/button';

type OverlayState = 'idle' | 'loading' | 'success' | 'error';

interface LoginPageOverlayContextType {
  showLoading: (message: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  hide: () => void;
}

const LoginPageOverlayContext = createContext<LoginPageOverlayContextType | undefined>(undefined);

/**
 * Hook customizado para usar o overlay da página de login.
 */
export function useLoginPageOverlay() {
  const context = useContext(LoginPageOverlayContext);
  if (!context) {
    throw new Error('useLoginPageOverlay must be used within a LoginPageOverlayProvider');
  }
  return context;
}

interface ProviderProps {
  children: ReactNode;
}

/**
 * Provider que gerencia o estado do overlay de feedback na página de login.
 */
export function LoginPageOverlayProvider({ children }: ProviderProps) {
  const [state, setState] = useState<OverlayState>('idle');
  const [message, setMessage] = useState<string>('');

  const showLoading = (msg: string) => {
    setMessage(msg);
    setState('loading');
  };

  const showSuccess = (msg: string) => {
    setMessage(msg);
    setState('success');
  };

  const showError = (msg: string) => {
    setMessage(msg);
    setState('error');
  };

  const hide = () => {
    setState('idle');
    setMessage('');
  };

  const getBackgroundColor = () => {
    switch (state) {
      case 'loading': return 'bg-sketch-accent';
      case 'success': return 'bg-sketch-success';
      case 'error': return 'bg-sketch-danger';
      default: return 'bg-transparent';
    }
  };

  return (
    <LoginPageOverlayContext.Provider value={{ showLoading, showSuccess, showError, hide }}>
      {children}
      <AnimatePresence>
        {state !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center ${getBackgroundColor()} transition-colors duration-500`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center justify-center"
            >
              {state === 'loading' && (
                <div className="flex flex-col items-center gap-6">
                  <div className="scale-[2.5] text-white">
                    <AppLoader size={40} />
                  </div>
                  <h2 className="mt-8 font-sketchHeading text-3xl font-bold text-white">
                    {message}
                  </h2>
                </div>
              )}

              {state === 'success' && (
                <div className="flex flex-col items-center">
                  <div className="w-64 h-64">
                    <Lottie animationData={successAnim} loop={false} />
                  </div>
                  <h2 className="font-sketchHeading text-3xl font-bold text-white">
                    {message}
                  </h2>
                </div>
              )}

              {state === 'error' && (
                <div className="flex flex-col items-center">
                  <div className="w-64 h-64">
                    <Lottie animationData={errorAnim} loop={false} />
                  </div>
                  <h2 className="font-sketchHeading text-3xl font-bold text-white max-w-md">
                    {message}
                  </h2>
                  <Button
                    onClick={hide}
                    className="mt-12 min-h-[56px] px-10 text-xl bg-white text-sketch-fg border-2 border-sketch-fg shadow-sketch hover:bg-sketch-bg hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoginPageOverlayContext.Provider>
  );
}
