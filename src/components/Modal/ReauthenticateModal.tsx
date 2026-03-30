'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { auth } from '@/lib/firebase';
import Image from 'next/image';

interface ReauthenticateModalProps {
    trigger?: React.ReactNode;
    confirmButtonFn: () => void;
    form: UseFormReturn<any>;
}

const ReauthenticateModal = ({ trigger, confirmButtonFn, form }: ReauthenticateModalProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const isGoogleUser = auth.currentUser?.providerData.some(p => p.providerId === 'google.com');

    async function handleConfirm() {
        setIsLoading(true);
        try {
            confirmButtonFn();
            handleOpenChange(false);
            setIsPasswordVisible(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleOpenChange(open: boolean) {
        setIsOpen(open);
        if (!open) {
            setIsPasswordVisible(false);
            form.resetField("password");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className='max-w-[400px]'>
                <DialogHeader>
                    <DialogTitle className="font-sketchHeading text-2xl">
                        {isGoogleUser ? "Reautenticação Google" : "Confirmação"}
                    </DialogTitle>
                    <DialogDescription className="font-sketch text-base">
                        {isGoogleUser
                            ? "Para sua segurança, confirme sua identidade com o Google para continuar."
                            : "Insira sua senha atual para completar a ação"}
                    </DialogDescription>
                </DialogHeader>
                {isGoogleUser ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-sketch-border flex items-center justify-center bg-white shadow-sketch-sm">
                            <Image
                                src="/images/google-logo.svg"
                                alt="Google"
                                width={32}
                                height={32}
                            />
                        </div>
                        <p className="font-sketch text-center text-sketch-fg/60">
                            Uma janela pop-up será aberta para você fazer login.
                        </p>
                    </div>
                ) : (
                    <div className="py-6 relative">
                        <Input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Senha atual"
                            {...form.register("password")}
                            className="w-full h-12 text-lg"
                        />
                        {isPasswordVisible ? (
                            <EyeOff
                                size={20}
                                strokeWidth={2.5}
                                className="absolute right-4 top-[38px] text-sketch-accent cursor-pointer"
                                onClick={() => setIsPasswordVisible(false)}
                            />
                        ) : (
                            <Eye
                                size={20}
                                strokeWidth={2.5}
                                className="absolute right-4 top-[38px] text-sketch-accent cursor-pointer"
                                onClick={() => setIsPasswordVisible(true)}
                            />
                        )}
                    </div>
                )}
                <DialogFooter>
                    <Button
                        disabled={( !isGoogleUser && !form.formState.dirtyFields.password) || isLoading}
                        className="w-full h-12 text-lg"
                        onClick={handleConfirm}
                    >
                        {
                            isLoading
                                ? <LoaderCircle size={22} className='animate-spin' />
                                : isGoogleUser ? 'Continuar com Google' : 'Confirmar'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReauthenticateModal;
