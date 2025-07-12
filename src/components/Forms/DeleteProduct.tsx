import { ProductsContext } from "@/context/ProductsContext";
import { IProductProps } from "@/types";
import React, { useContext, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

export const DeleteProduct = ({
  item,
}: {
  item: IProductProps | undefined;
}) => {
  const { handleDeleteItem } = useContext(ProductsContext);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="px-3 text-sm text-subtitle">Excluir</span>
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
            onClick={() => handleDeleteItem(item!.id)}
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
    // <React.Fragment>
    //     {isVisible && (
    //         <div className={`${isFading ? 'opacity-100 visible' : 'opacity-0 invisible'} w-[350px] rounded bg-app-container border p-5 transition-all duration-500`}>
    //             <h2 className='text-center text-subtitle font-semibold'>Deseja realmente deletar o produto?</h2>
    //             <div className='flex gap-2 mt-5'>
    //                 <button
    //                     type='button'
    //                     onClick={() => handleDeleteItem(item!.id)}
    //                     className='col-span-1 flex items-center justify-center w-full bg-secondary-blue py-2 px-3 rounded text-snow'>
    //                     Sim
    //                 </button>
    //                 <button
    //                     type='button'
    //                     onClick={() => setModal({
    //                         state: 'CLOSED',
    //                         type: null
    //                     })}
    //                     className='col-span-1 flex items-center justify-center w-full border border-subtitle py-2 px-3 rounded text-subtitle'>
    //                     Cancelar
    //                 </button>
    //             </div>
    //         </div>
    //     )}
    // </React.Fragment>
  );
};
