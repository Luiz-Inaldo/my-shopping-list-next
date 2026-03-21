"use client";
import { useShoplistContext } from "@/context/ShoplistContext";
import { IEditItemProps } from "@/types";
import { IProductProps } from "@/types";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ShadSelect } from "../Select";
import { SelectItem } from "../ui/select";
import { UNIT_TYPES } from "@/constants/unitTypes";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PurchaseProductInput, PurchaseProductSchema } from "@/zodSchema/addPurchaseProduct";

export const EditProductForm = ({
  item,
  closeDropdown
}: {
  item: IProductProps | undefined;
  closeDropdown: () => void;
}) => {
  const {
    control,
    handleSubmit,
  } = useForm<PurchaseProductInput>({
    resolver: zodResolver(PurchaseProductSchema),
    defaultValues: {
      category: item?.category,
      unit_type: item?.unit_type,
      name: item?.name,
      value: item?.value,
      quantity: item?.quantity,
      checked: item?.checked,
    }
  });

  const { handleUpdateItem } = useShoplistContext();
  const [open, setOpen] = useState(false);

  async function onSubmit(data: PurchaseProductInput) {
    if (!item || !item.id) return;
    data.value = Number(String(data.value).replace(",", "."));
    await handleUpdateItem(data, item.id);
    setOpen(false);
    closeDropdown();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-3 text-sm text-subtitle">Editar</button>
      </DialogTrigger>
      <DialogContent className="p-5 max-w-[400px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-subtitle text-lg text-center">
            O que deseja editar no produto?
          </DialogTitle>
          <DialogDescription hidden />
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <label htmlFor="name" className="flex flex-col mt-3">
            <span className="text-subtitle text-sm font-semibold">Nome:</span>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  
                />
              )}
            />
          </label>
          <label htmlFor="unit_type" className="flex flex-col mt-3">
            <span className="text-subtitle text-sm font-semibold">Tipo de unidade:</span>
            <ShadSelect
              control={control}
              label='Selecione o tipo de unidade'
              name="unit_type"
            >
              {UNIT_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </ShadSelect>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label htmlFor="value" className="flex flex-col col-span-1">
              <span className="text-subtitle text-sm font-semibold">Valor:</span>
              <Controller
                control={control}
                name="value"
                render={({ field }) => (
                  <Input
                    type="text"
                    {...field}
                  />
                )}
              />
            </label>
            <label htmlFor="quantity" className="flex flex-col col-span-1">
              <span className="text-subtitle text-sm font-semibold">Quantidade:</span>
              <Controller
                control={control}
                name="quantity"
                render={({ field }) => (
                  <Input
                    type="number"
                    {...field}
                  />
                )}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-5">
            <Button
              type="submit"
              className="col-span-1 w-full"
            >
              Finalizar Edição
            </Button>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="outline"
              className="col-span-1 w-full"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
