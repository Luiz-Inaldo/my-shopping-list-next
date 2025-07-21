import { ProductsContext } from "@/context/ProductsContext";
import { IEditItemProps } from "@/types";
import { IProductProps } from "@/types";
import { Dialog } from "@radix-ui/react-dialog";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const CheckItemForm = ({
  item,
}: {
  item: IProductProps | undefined;
}) => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IEditItemProps>();

  const { handleCheckItem } = useContext(ProductsContext);
  const [open, setOpen] = useState(false);

  async function onSubmit(data: IEditItemProps) {
    handleCheckItem(item!, data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <input
          type="checkbox"
          checked={item?.checked}
          id={item?.name}
          className="w-4 h-4 accent-primary-blue border-2 border-paragraph rounded"
        />
      </DialogTrigger>
      <DialogContent
        className="max-w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-subtitle font-semibold">
            Quanto você pagará por esse produto?
          </DialogTitle>
        </DialogHeader>
        <DialogDescription hidden />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 p-5">
          <label htmlFor="value" className="flex flex-col">
            <input
              defaultValue={item?.value}
              type="text"
              {...register("value", { required: true })}
              placeholder="R$: 0,00"
              className="w-full text-subtitle rounded border border-border px-3 py-2 h-8 text-ellipsis overflow-hidden whitespace-nowrap"
            />
          </label>
          <div className="grid grid-cols-2 gap-2 mt-5">
            <button
              type="submit"
              className="col-span-1 flex items-center justify-center w-full bg-secondary-blue py-2 px-3 rounded text-snow"
            >
              Marcar Produto
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
  );
};
