import { useShoplistContext } from "@/context/ShoplistContext";
import { IProductProps } from "@/types";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

export const DeleteProduct = ({
  item,
  closeDropdown
}: {
  item: IProductProps | undefined;
  closeDropdown: () => void;
}) => {
  const { handleDeleteItem } = useShoplistContext();
  const [open, setOpen] = useState(false);

  async function saveAndCloseModal() {
    if (!item || !item.id) return;
    await handleDeleteItem(item.id);
    setOpen(false);
    closeDropdown();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-3 text-sm text-subtitle">Excluir</button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-center text-subtitle font-semibold">
            Deseja realmente deletar o produto?
          </DialogTitle>
        </DialogHeader>
        <DialogDescription hidden />
        <div className="flex gap-2 mt-5">
          <Button
            type="button"
            onClick={() => saveAndCloseModal()}
            className="col-span-1 w-full rounded-full"
          >
            Sim
          </Button>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            variant="outline"
            className="col-span-1 w-full rounded-full"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
