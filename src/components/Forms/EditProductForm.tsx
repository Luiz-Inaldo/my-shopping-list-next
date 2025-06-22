"use client";
import { ProductsContext } from "@/context/ProductsContext";
import { IEditItemProps } from "@/types";
import { IProductProps } from "@/types";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const EditProductForm = ({
  item,
}: {
  item: IProductProps | undefined;
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IEditItemProps>();

  const { handleUpdateItem } = useContext(ProductsContext);
  const [open, setOpen] = useState(false);

  async function onSubmit(data: IEditItemProps) {
    await handleUpdateItem(data, item!.id);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="px-3 text-sm text-subtitle">Editar</span>
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
            <span className="text-subtitle">Nome:</span>
            <Controller
              control={control}
              name="name"
              defaultValue={item?.name}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className="w-full text-paragraph rounded border px-3 py-2 h-8 text-ellipsis overflow-hidden whitespace-nowrap"
                />
              )}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label htmlFor="value" className="flex flex-col col-span-1">
              <span className="text-subtitle">Valor:</span>
              <Controller
                control={control}
                name="value"
                defaultValue={item?.value || "0,00"}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full text-paragraph rounded border px-3 py-2 h-8"
                  />
                )}
              />
            </label>
            <label htmlFor="quantity" className="flex flex-col col-span-1">
              <span className="text-subtitle">Quantidade:</span>
              <Controller
                control={control}
                name="quantity"
                defaultValue={item?.quantity}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className="w-full text-paragraph rounded border px-3 py-2 h-8"
                  />
                )}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-5">
            <button
              type="submit"
              className="col-span-1 flex items-center justify-center w-full bg-secondary-blue py-2 px-3 rounded text-snow"
            >
              Finalizar Edição
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="col-span-1 flex items-center justify-center w-full border border-subtitle py-2 px-3 rounded text-subtitle"
            >
              Cancelar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    // <React.Fragment>
    //     {isVisible && (
    //         <div className={`${isFading ? 'opacity-100 visible' : 'opacity-0 invisible'} w-[350px] rounded bg-app-container border transition-all duration-500`}>

    //         </div>
    //     )}
    // </React.Fragment>
  );
};
