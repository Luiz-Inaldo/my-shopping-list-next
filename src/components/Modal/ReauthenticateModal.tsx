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

interface ReauthenticateModalProps {
    trigger?: React.ReactNode;
    confirmButtonFn: () => void;
    form: UseFormReturn<any>;
}

const ReauthenticateModal = ({ trigger, confirmButtonFn, form }: ReauthenticateModalProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

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
            <DialogContent className='2xsm:max-w-[400px] rounded-md'>
                <DialogHeader>
                    <DialogTitle>Confirmação</DialogTitle>
                    <DialogDescription>
                        Insira sua senha atual para completar a ação
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 relative">
                    <Input
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Senha atual"
                        {...form.register("password")}
                        className="w-full"
                    />
                    {isPasswordVisible ? (
                        <EyeOff
                            size={14}
                            className="absolute right-3 top-[26px] text-gray-400 cursor-pointer"
                            onClick={() => setIsPasswordVisible(false)}
                        />
                    ) : (
                        <Eye
                            size={14}
                            className="absolute right-3 top-[26px] text-gray-400 cursor-pointer"
                            onClick={() => setIsPasswordVisible(true)}
                        />
                    )}
                </div>
                <DialogFooter>
                    <Button
                        disabled={!form.formState.dirtyFields.password || isLoading}
                        className="text-snow"
                        onClick={handleConfirm}
                    >
                        {
                            isLoading
                                ? <LoaderCircle size={16} className='animate-spin' />
                                : 'Confirmar'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReauthenticateModal;
