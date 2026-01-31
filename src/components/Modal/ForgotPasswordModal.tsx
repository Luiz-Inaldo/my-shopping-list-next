'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppLoader } from '../Loader/app-loader';
import { Send } from 'lucide-react';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { tryCatchRequest } from '@/functions/requests';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/zodSchema/forgotPassword';

interface ForgotPasswordModalProps {
    trigger: React.ReactNode;
    email?: string;
}

const ForgotPasswordModal = ({ trigger, email }: ForgotPasswordModalProps) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, submitTransition] = useTransition();

    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        values: {
            email: email || '',
        }
    });

    const emailValue = form.watch('email');

    // Requirement: Submit button disabled if no value in input
    const isButtonDisabled = !emailValue || isSubmitting;

    async function onSubmit() {
        submitTransition(async () => {

            const [response, error] = await tryCatchRequest(() => sendPasswordResetEmail(auth, form.getValues('email')));

            if (response) {
                sendToastMessage({
                    title: "Email de recuperação de senha enviado com sucesso",
                    type: 'success'
                });
            }

            if (error) {
                sendToastMessage({
                    title: error.code || "Erro ao enviar email de recuperação de senha",
                    type: 'error'
                });
            }

            setOpen(false);
            form.reset({
                email: '',
            });
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Recuperar Senha</DialogTitle>
                    <DialogDescription>
                        Informe seu e-mail para receber as instruções de recuperação de senha.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="seu@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                onClick={onSubmit}
                                disabled={isButtonDisabled}
                            >
                                {isSubmitting ? <>
                                    <AppLoader size={18} />
                                    Enviando email...
                                </> : <>
                                    <Send size={18} />
                                    Enviar
                                </>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordModal;

