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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="mr-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer">
          <EllipsisVertical size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <EditProductForm item={item} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteProduct item={item} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
