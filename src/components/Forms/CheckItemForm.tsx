import { IEditItemProps } from "@/types";
import { IProductProps } from "@/types";
import { Dialog } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useShoplistContext } from "@/context/ShoplistContext";

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

  const { handleCheckItem } = useShoplistContext()
  const [open, setOpen] = useState(false);

  async function onSubmit(data: IEditItemProps) {
    data.value = Number(String(data.value).replace(",", "."));
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
            <span className="text-subtitle text-sm font-semibold">Digite o valor:</span>
            <Input
              defaultValue={item?.value}
              type="text"
              {...register("value", { required: true })}
              placeholder="R$: 0,00"
              autoFocus={false}
            />
            {/* <input
              defaultValue={item?.value}
              type="text"
              {...register("value", { required: true })}
              placeholder="R$: 0,00"
              autoFocus={false}
              className="w-full text-subtitle rounded border border-border px-3 py-2 h-8 text-ellipsis overflow-hidden whitespace-nowrap"
            /> */}
          </label>
          <div className="grid grid-cols-2 gap-2 mt-5">
            <Button
              type="submit"
              className="col-span-1"
            >
              Marcar Produto
            </Button>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="outline"
              className="col-span-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
