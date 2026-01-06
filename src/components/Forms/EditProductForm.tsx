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
import { UNIT_TYPES } from "@/data/unitTypes";

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
  } = useForm<IEditItemProps>();

  const { handleUpdateItem } = useShoplistContext();
  const [open, setOpen] = useState(false);

  async function onSubmit(data: IEditItemProps) {
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
              defaultValue={item?.name}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className="w-full text-subtitle bg-app-background text-sm rounded-full border px-3 py-2 h-8 text-ellipsis overflow-hidden whitespace-nowrap"
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
              defaultValue={item?.unit_type}
            >
              {UNIT_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </ShadSelect>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label htmlFor="value" className="flex flex-col col-span-1">
              <span className="text-subtitle text-sm font-semibold">Valor:</span>
              <Controller
                control={control}
                name="value"
                defaultValue={String(item?.value).replace(".", ",") || "0"}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full text-subtitle bg-app-background text-sm rounded-full border px-3 py-2 h-8"
                  />
                )}
              />
            </label>
            <label htmlFor="quantity" className="flex flex-col col-span-1">
              <span className="text-subtitle text-sm font-semibold">Quantidade:</span>
              <Controller
                control={control}
                name="quantity"
                defaultValue={item?.quantity}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className="w-full text-subtitle bg-app-background text-sm rounded-full border px-3 py-2 h-8"
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
