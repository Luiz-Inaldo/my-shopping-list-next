"use client";
import React, { useContext, useState, useTransition } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LoaderCircle, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { ShadSelect } from "../Select";
import { SelectItem } from "../ui/select";
import { CATEGORIES } from "@/constants/categories";
import { IFormItem } from "@/types";
import { Button } from "../ui/button";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { useShoplistContext } from "@/context/ShoplistContext";
import { addPurchaseItem } from "@/services/productsListServices";
import { UNIT_TYPES } from "@/data/unitTypes";


export const AddProductForm = () => {

  const [isLoading, startAddProductTransition] = useTransition();

  const { productsList, fetchListItemsData } = useShoplistContext();
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit
  } = useForm<IFormItem>();

  // funções
  function onSubmit(data: IFormItem) {
    startAddProductTransition(async () => {
      const item = {
        ...data
      };

      if (!item.value) {
        item.value = 0;
      }

      if (typeof item.value === "string") {
        item.value = Number(String(item.value).replace(",", "."));
      } else {
        item.value = Number(item.value);
      }

      if (!item.quantity) {
        item.quantity = 0;
      } else if (typeof item.quantity === "string") {
        item.quantity = Number(String(item.quantity).replace(",", "."));
      }

      // console.log(item)
      // return;

      try {
        await addPurchaseItem(productsList?.id as string, item);

        sendToastMessage({
          title: "Produto adicionado com sucesso!",
          type: "success"
        });

        fetchListItemsData();

        // setProductsList(previous => ({
        //   ...previous!,
        //   purchase_items: [...previous!.purchase_items!, item]
        // }));

        reset();
      } catch (error) {
        sendToastMessage({
          title: "Erro ao adicionar produto",
          type: "error"
        });
        console.error("Error adding product:", error);
      }
    })
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          onClick={() => { }}
          size="sm"
          className="fixed rounded-full bottom-5 right-5 h-fit px-2 py-1"
        >
          <Plus size={24} />
          <p>Adicionar Produto</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-app-container rounded-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <DrawerHeader>
            <DrawerTitle>Adicionar novo produto</DrawerTitle>
            <DrawerDescription>Preencha o formulário abaixo</DrawerDescription>
          </DrawerHeader>
          <div className='flex flex-col gap-5 p-5'>

            <label htmlFor="name" className='relative flex flex-col'>
              <span className='text-subtitle text-sm font-semibold mb-1 leading-none'>Nome do produto:</span>
              <input
                type="text"
                placeholder="Digite o nome do produto"
                className='w-full flex h-8 rounded-full border text-subtitle border-gray-300 bg-app-background px-3 py-2 text-sm'
                {...register('name', { required: true })}
              />
              {errors.name && <span className='text-xs text-red-500'>
                Campo obrigatório
              </span>}
            </label>

            <label htmlFor="category" className='relative flex flex-col col-span-1'>
              <span className='text-subtitle text-sm font-semibold mb-1 leading-none'>Categoria:</span>
              <ShadSelect control={control} label='Escolha a categoria' name="category">
                {CATEGORIES.map(category => (
                  <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                ))}
              </ShadSelect>
              {errors.category && <span className='text-xs text-red-500'>
                Campo obrigatório
              </span>}
            </label>

            <label htmlFor="unit_type" className='relative flex flex-col col-span-1'>
              <span className='text-subtitle text-sm font-semibold mb-1 leading-none'>Tipo de unidade:</span>
              <ShadSelect control={control} label='Selecione o tipo de unidade' name="unit_type">
                {UNIT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </ShadSelect>
              {errors.category && <span className='text-xs text-red-500'>
                Campo obrigatório
              </span>}
            </label>

            <div className='grid grid-cols-2 gap-2'>
              <label htmlFor="quantity" className='relative flex flex-col col-span-1'>
                <span className='text-subtitle text-sm font-semibold mb-1 leading-none'>Quantidade:</span>
                <input
                  type="text"
                  placeholder="0"
                  className='w-full flex h-8 rounded-full border text-subtitle border-gray-300 bg-app-background px-3 py-2 text-sm'
                  {...register('quantity')}
                />
                {errors.quantity && <span className='text-xs text-red-500'>
                  Campo obrigatório
                </span>}
              </label>

              <label htmlFor="value" className='relative flex flex-col'>
                <span className='text-subtitle text-sm font-semibold mb-1 leading-none'>Valor:</span>
                <input
                  type="text"
                  placeholder="0,00"
                  className='w-full flex h-8 rounded-full border text-subtitle border-gray-300 bg-app-background px-3 py-2 text-sm'
                  {...register('value')}
                />
              </label>
            </div>


            <label htmlFor="checked" className='relative flex items-center gap-5'>
              <span className='text-subtitle text-sm font-semibold mb-1 leading-none'>Já adquirido?</span>
              <input
                type="checkbox"
                className="w-4 h-4 accent-default-green bg-app-background border-1 border-paragraph rounded checked:border-transparent"
                {...register('checked')}
              />
            </label>


          </div>
          <DrawerFooter>
            <Button type='submit'>
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" size={16} />
                  Adicionando produto...
                </>
              ) : (
                "Adicionar produto"
              )}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
