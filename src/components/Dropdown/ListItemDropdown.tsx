import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { EditProductForm } from "../Forms/EditProductForm";
import { DeleteProduct } from "../Forms/DeleteProduct";
import { IProductProps } from "@/types";

export const ListItemDropdown = ({ item }: { item: IProductProps }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-sketch-section-label border-2 border-sketch-border bg-sketch-white text-sketch-fg shadow-sketch-1 transition-[transform,box-shadow] duration-100 hover:-rotate-1 hover:shadow-sketch-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <EllipsisVertical size={16} strokeWidth={2.5} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-sketch-notif border-2 border-sketch-border bg-sketch-white font-sketch shadow-sketch">
        <DropdownMenuItem asChild>
          <EditProductForm closeDropdown={() => setOpen(false)} item={item} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteProduct closeDropdown={() => setOpen(false)} item={item} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
