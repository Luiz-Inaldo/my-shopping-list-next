'use client';

import { IPurchaseProps } from '@/types';
import React, { useContext, useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Trash2 } from 'lucide-react';
import { tryCatchRequest } from '@/functions/requests';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { deletePurchaseFromDb } from '@/services/purchasesListServices';
import { PurchasesContext } from '@/context/PurchasesContext';

const sketchDeleteTriggerClass =
  'flex h-10 w-10 shrink-0 items-center justify-center border-2 border-sketch-danger bg-sketch-danger-lt text-sketch-danger shadow-sketch-delete transition-[transform,box-shadow,background-color,color] duration-100 hover:bg-sketch-danger hover:text-white hover:shadow-sketch-danger-hover hover:translate-x-px hover:translate-y-px active:translate-x-[3px] active:translate-y-[3px] active:shadow-none';

export type DeletePurchaseMode = 'delete' | 'unlink';

export const DeletePurchase = ({
  purchase,
  trigger,
  mode = 'delete',
}: {
  purchase: IPurchaseProps;
  trigger?: React.ReactNode;
  mode?: DeletePurchaseMode;
}) => {
  const [open, setOpen] = useState(false);
  const purchasesContext = useContext(PurchasesContext);

  async function handleConfirm() {
    const purchaseId = purchase.id as string;

    const [, error] = await tryCatchRequest<void, Error>(async () => {
      if (mode === 'unlink') {
        if (!purchasesContext?.unlinkSharedPurchase) {
          throw new Error('unlinkSharedPurchase requires PurchasesProvider');
        }
        await purchasesContext.unlinkSharedPurchase(purchaseId);
        return;
      }

      if (purchasesContext?.deletePurchase) {
        await purchasesContext.deletePurchase(purchaseId);
        return;
      }

      // fallback para caso o contexto não esteja disponível
      await deletePurchaseFromDb(purchaseId);
      sendToastMessage({
        title: 'Compra deletada com sucesso!',
        type: 'success',
      });
    });

    if (error) {
      console.error(error);
      sendToastMessage({
        title:
          mode === 'unlink'
            ? 'Erro ao desvincular lista!'
            : 'Erro ao deletar compra!',
        type: 'error',
      });
    }

    setOpen(false);
  }

  const isUnlink = mode === 'unlink';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className={sketchDeleteTriggerClass}
            style={{ borderRadius: '10px 4px 8px 4px / 4px 10px 4px 8px' }}
            aria-label={isUnlink ? 'Desvincular lista' : 'Excluir lista'}
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[400px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-center font-sketchHeading text-subtitle font-semibold">
            {isUnlink ? 'Desvincular lista' : 'Deletar lista'}
          </DialogTitle>
          <DialogDescription>
            {isUnlink
              ? `Deseja desvincular a lista ${purchase.title}? Você deixará de ter acesso a ela.`
              : `Deseja realmente deletar a lista ${purchase.title}?`}
          </DialogDescription>
        </DialogHeader>
        <DialogDescription hidden />
        <div className="mt-10 flex gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="w-full"
          >
            Sim
          </Button>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            variant="outline"
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
