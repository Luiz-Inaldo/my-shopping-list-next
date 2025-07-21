import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const FinalizePurchaseModal = ({
  finalizePurchase,
  trigger,
}: {
  finalizePurchase: () => void;
  trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  function handleFinalize() {
    finalizePurchase();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-5">
          <DialogTitle>Finalizar Compra</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja finalizar a compra? Certifique-se de que
            todos os <b>itens que você deseja estejam</b> realmente marcados
            como &quot;adquirido&quot; antes de continuar
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex !flex-row items-center justify-center gap-3 mt-3">
          <Button
            onClick={handleFinalize}
            className="w-[140px] rounded-full"
          >
            Finalizar
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="destructive"
            className="w-[140px] rounded-full"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinalizePurchaseModal;
