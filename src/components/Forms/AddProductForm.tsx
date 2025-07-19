"use client";
import React, { useContext } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { ShadSelect } from "../Select";
import { SelectItem } from "../ui/select";
import { CATEGORIES } from "@/constants/categories";
import { supabase } from "@/lib/api";
import { ProductsContext } from "@/context/ProductsContext";
import { IFormItem } from "@/types";
import useGeneralUserStore from "@/store/generalUserStore";
import { Button } from "../ui/button";
import { sendToastMessage } from "@/functions/sendToastMessage";

export const AddProductForm = () => {
  const user = useGeneralUserStore((store) => store.user);

  const { fetchData } = useContext(ProductsContext);
  const {
    register,
    watch,
    control,
    formState: { errors },
    reset,
    handleSubmit
  } = useForm<IFormItem>();

  // funções
  async function onSubmit(data: IFormItem) {
    const item = {
      ...data,
      user_id: user?.id,
    };

    if (item.value === "") {
      item.value = "0,00";
    }

    if (!item.quantity) {
      item.quantity = 0;
    }

    try {
      const response = await supabase.from("products").insert([item]).select();

      if (response.status === 201) {
        sendToastMessage({
          title: "Produto adicionado com sucesso!",
          type: "success"
        });

        fetchData();
      }

      reset()
    } catch (error) {
      sendToastMessage({
        title: "Erro ao adicionar produto",
        type: "error"
      });
      console.error("Error adding product:", error);
    }
  }

  return (
    <Drawer>
      <DrawerTrigger className="relative flex items-center justify-center">
        {/* <span className='absolute w-8 h-8 top-1.5 animate-ping z-[-1] bg-primary-blue rounded-full'></span> */}
        <Button
          onClick={() => { }}
          size="icon"
          className="rounded-full cursor-pointer shadow-md p-0 text-2xl"
        >
          <Plus className="svg-shadow" size={24} />
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

            <div className='grid grid-cols-2 gap-2'>
              <label htmlFor="quantity" className='relative flex flex-col col-span-1'>
                <span className='text-subtitle text-sm font-semibold mb-1 leading-none'>Quantidade:</span>
                <input
                  type="number"
                  placeholder="0"
                  className='w-full flex h-8 rounded-full border text-subtitle border-gray-300 bg-app-background px-3 py-2 text-sm'
                  {...register('quantity', { required: true })}
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
              Adicionar
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
