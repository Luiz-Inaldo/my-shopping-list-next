'use client';
import React, { useContext, useState } from 'react'
import { ToastAction } from '../ui/toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';
import { avatarImgUrls } from '@/constants/avatarImgUrl';
import { Check, LoaderCircle } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { supabase } from '@/lib/api';
import useGeneralUserStore from '@/store/generalUserStore';
import { Button } from '../ui/button';

const ChangeAvatarModal = ({ children, currentAvatarUrl, refetch }: { 
    children?: React.ReactNode;
    currentAvatarUrl?: string;
    refetch?: () => void
}) => {

    const user = useGeneralUserStore(store => store.user)

    const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatarUrl ?? '');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function changeAvatar() {
        setIsLoading(true);
        try {
            const {data, error} = await supabase.from('profiles')
            .update({profile_img: selectedAvatar})
            .eq('email', user?.email);

            refetch?.();

            toast({
                title: 'Avatar alterado com sucesso!',
                action: <ToastAction altText="Ok">Ok</ToastAction>
            })

        } catch (error) {
            console.error(error)
            toast({
                title: 'Erro ao alterar avatar',
                description: 'Tente novamente mais tarde',
                variant: 'destructive',
                action: <ToastAction altText="Ok">Ok</ToastAction>
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger className='text-sm py-1.5 px-2'>{children ? children : 'Change Avatar'}</DialogTrigger>
            <DialogContent className='2xsm:max-w-[400px] rounded-md'>
                <DialogHeader>
                    <DialogTitle>Escolha seu novo avatar</DialogTitle>
                    <DialogDescription>
                        Selecione uma das imagens disponíveis e confirme para alterar
                        o avatar
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-4 items-center gap-5 p-4 rounded-md border">
                    {avatarImgUrls.map((url) => (
                        <div
                            key={url}
                            className={`relative`}
                            onClick={() => setSelectedAvatar(url)}
                        >
                            <Image
                                src={url}
                                alt="Avatar"
                                width={50}
                                height={50}
                                className="rounded-full mx-auto"
                            />
                            <div className={`${selectedAvatar === url ? 'opacity-100 visible' : 'opacity-0 invisible'} absolute -right-1.5 top-0 flex items-center justify-center size-5 rounded-full border-2 border-snow bg-default-green text-snow`}>
                                <Check size={12} />
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button
                        disabled={!selectedAvatar}
                        className="text-snow"
                        onClick={changeAvatar}
                    >
                        {
                            isLoading 
                            ? <LoaderCircle size={16} className='animate-spin' />
                            : 'Alterar'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ChangeAvatarModal;
