'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useGeneralUserStore from '@/store/generalUserStore';
import { useEffect, useState, useRef, useTransition } from 'react';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
    convertToPixelCrop
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { DialogDescription } from '@radix-ui/react-dialog';
import { tryCatchRequest } from '@/functions/requests';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { updateProfileImage } from '@/services/account';
import { AppLoader } from '../Loader/app-loader';

/**
 * Interface para as propriedades do componente ProfileImgChangerModal.
 */
interface ProfileImgChangerModalProps {
    /** Indica se o modal está aberto. */
    isOpen: boolean;
    /** Função chamada quando o estado de abertura do modal muda. */
    onOpenChange: (open: boolean) => void;
    /** Imagem selecionada para corte. */
    file: File | null;
    /** Função disparada ao clicar para alterar a foto. */
    onChangePhoto?: () => void;
    /** Função disparada ao clicar para remover a foto. */
    onRemovePhoto?: () => void;
}

/**
 * Função utilitária para centralizar o corte inicial.
 */
function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

/**
 * Componente de modal para cortar e gerenciar a imagem de perfil do usuário.
 */
export default function ProfileImgChangerModal({
    isOpen,
    onOpenChange,
    file,
    onRemovePhoto,
}: ProfileImgChangerModalProps) {

    const { userProfile } = useGeneralUserStore();

    const [imgSrc, setImgSrc] = useState('');
    const [isLoading, onUpdate] = useTransition();
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const aspect = 1;


    useEffect(() => {
        if (file) {
            setCrop(undefined); // Reseta o corte ao mudar o arquivo
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() || ''),
            );
            reader.readAsDataURL(file);
        }
    }, [file]);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect));
    }

    /**
     * Converte o corte do canvas em um objeto File.
     */
    async function getCroppedFile(image: HTMLImageElement, crop: PixelCrop): Promise<File> {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width;
        canvas.height = crop.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const fileName = file?.name || 'profile.jpg';
                const croppedFile = new File([blob], fileName, {
                    type: file?.type || 'image/jpeg',
                    lastModified: Date.now()
                });
                resolve(croppedFile);
            }, file?.type || 'image/jpeg', 1);
        });
    }

    async function handleSave() {
        onUpdate(async () => {
            if (completedCrop && imgRef.current) {
                const [croppedFile, getCroppedError] = await tryCatchRequest<File, Error>(getCroppedFile(imgRef.current!, completedCrop));
                if (getCroppedError) {
                    console.error('Erro ao processar imagem:', getCroppedError);
                    sendToastMessage({
                        type: 'error',
                        title: 'Erro ao processar imagem',
                    })
                    return;
                }

                if (!croppedFile) {
                    sendToastMessage({
                        type: 'error',
                        title: 'Erro ao processar imagem',
                    })
                    return;
                }

                const [_, updateError] = await tryCatchRequest<void, Error>(updateProfileImage(userProfile?.uid as string, croppedFile));
                if (updateError) {
                    console.error('Erro ao atualizar imagem:', updateError);
                    sendToastMessage({
                        type: 'error',
                        title: 'Erro ao atualizar imagem',
                    })
                    return;
                }
                sendToastMessage({
                    type: 'success',
                    title: 'Imagem atualizada com sucesso',
                })
                onOpenChange(false);
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] border-none bg-app-container overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-subtitle font-semibold text-lg text-left">
                        Ajustar imagem
                    </DialogTitle>
                    <DialogDescription className="text-sm text-paragraph text-left">
                        Selecione a área da imagem que deseja cortar.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-6 mt-4 w-full">
                    {imgSrc && (
                        <div className="max-h-[60vh] overflow-auto flex justify-center rounded-lg w-full">
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                                circularCrop
                                className="max-w-full"
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                    style={{ maxHeight: '50vh' }}
                                />
                            </ReactCrop>
                        </div>
                    )}

                    <div className="flex w-full gap-3 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 h-11 text-subtitle font-medium border-app-primary/20 hover:bg-app-primary/5"
                        >
                            Cancelar
                        </Button>
                        <Button
                            disabled={!completedCrop || isLoading}
                            onClick={handleSave}
                            className="flex-1 h-11 text-snow font-semibold bg-app-primary hover:bg-app-primary-hover shadow-lg transition-all active:scale-95"
                        >
                            {isLoading ? <AppLoader size={16} /> : 'Salvar'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
