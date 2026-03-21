import { IPurchaseProps } from '@/types';
import React, { useState } from 'react';
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
import { sendToastMessage } from '@/functions/sendToastMessage';
import { deletePurchaseFromDb } from '@/services/purchasesListServices';

const sketchDeleteTriggerClass =
  'flex h-10 w-10 shrink-0 items-center justify-center border-2 border-sketch-danger bg-sketch-danger-lt text-sketch-danger shadow-sketch-delete transition-[transform,box-shadow,background-color,color] duration-100 hover:bg-sketch-danger hover:text-white hover:shadow-sketch-danger-hover hover:translate-x-px hover:translate-y-px active:translate-x-[3px] active:translate-y-[3px] active:shadow-none';

export const DeletePurchase = ({
  purchase,
  trigger,
}: {
  purchase: IPurchaseProps;
  trigger?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  async function handleDeletePurchase(purchaseId: string) {
    try {
      await deletePurchaseFromDb(purchaseId);
      sendToastMessage({ title: 'Compra deletada com sucesso!', type: 'success' });
    } catch (error) {
      console.error(error);
      sendToastMessage({ title: 'Erro ao deletar compra!', type: 'error' });
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className={sketchDeleteTriggerClass}
            style={{ borderRadius: '10px 4px 8px 4px / 4px 10px 4px 8px' }}
            aria-label="Excluir lista"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[400px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-center font-sketchHeading text-subtitle font-semibold">
            Deletar lista
          </DialogTitle>
          <DialogDescription>
            {`Deseja realmente deletar a lista ${purchase.title}?`}
          </DialogDescription>
        </DialogHeader>
        <DialogDescription hidden />
        <div className="mt-5 flex gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleDeletePurchase(purchase.id as string)}
            className="w-full"
          >
            Sim
          </Button>
          <Button type="button" onClick={() => setOpen(false)} variant="outline" className="w-full">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
