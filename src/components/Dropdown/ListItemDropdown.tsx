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
        <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer">
          <EllipsisVertical size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
