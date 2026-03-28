'use client';

import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash2 } from 'lucide-react';
import useGeneralUserStore from '@/store/generalUserStore';

/**
 * Interface para as propriedades do componente ProfileCardDropdown.
 */
interface ProfileCardDropdownProps {
    /** Função disparada para abrir o modal de alteração de imagem. */
    onAlterPhoto: (img: File) => void;
    /** Função disparada para remover a foto atual. */
    onRemovePhoto?: () => void;
    /** Elemento que servirá como gatilho para o dropdown. */
    children: React.ReactNode;
}

/**
 * Componente de dropdown para ações rápidas no perfil do usuário.
 * 
 * @param {ProfileCardDropdownProps} props - Propriedades do componente.
 * @returns {JSX.Element} O componente renderizado.
 */
export function ProfileCardDropdown({
    onAlterPhoto,
    onRemovePhoto,
    children,
}: ProfileCardDropdownProps) {
    const { userProfile } = useGeneralUserStore();
    const [open, setOpen] = useState<boolean>(false);

    // Regra solicitada: Só pode ser clicado caso o usuário NÃO tenha a profile_img
    const canRemove = userProfile?.profile_img;

    function handleAlterPhoto(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            onAlterPhoto(file);
            setOpen(false);
        }
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="center"
                className="w-fit rotate-1"
            >
                <DropdownMenuItem
                    className="flex items-center gap-3 p-3 cursor-pointer transition-colors"
                    onSelect={(e) => e.preventDefault()}
                >
                    <label htmlFor="profile-img" className="flex text-sm items-center gap-3 w-full cursor-pointer">
                        <ImagePlus size={20} strokeWidth={2.5} className="text-sketch-accent" />
                        <span>Alterar imagem</span>
                        <input
                            type="file"
                            name="profile-img"
                            id="profile-img"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleAlterPhoto(e)}
                        />
                    </label>
                </DropdownMenuItem>

                {canRemove && (
                    <DropdownMenuItem
                        onClick={onRemovePhoto}
                        onSelect={(e) => e.preventDefault()}
                        className="flex items-center gap-3 p-3 cursor-pointer text-sketch-danger focus:bg-sketch-danger-lt focus:text-sketch-danger transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 size={20} strokeWidth={2.5} />
                        <span className="text-sm">Remover imagem atual</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
