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
import { zodResolver } from "@hookform/resolvers/zod";
import { ShadSelect } from "../Select";
import { SelectItem } from "../ui/select";
import { CATEGORIES } from "@/constants/categories";
import { addPurchaseProductSchema, AddPurchaseProductInput } from "@/zodSchema/addPurchaseProduct";
import { ItemCategories } from "@/enums/categories";
import { UnitTypes } from "@/enums/unitTypes";
import { IProductProps } from "@/types";
import { Button } from "../ui/button";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { useShoplistContext } from "@/context/ShoplistContext";
import { addPurchaseItem } from "@/services/productsListServices";
import { UNIT_TYPES } from "@/data/unitTypes";
import { queryClient } from "@/utils/queryClient";
import { QUERY_KEYS } from "@/constants/queryKeys";
import useGeneralUserStore from "@/store/generalUserStore";


export const AddProductForm = () => {

  const user = useGeneralUserStore(s => s.userProfile);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, startAddProductTransition] = useTransition();
  const isButtonDisabled = user ? !user.emailVerified : false;

  const { productsList } = useShoplistContext();
  
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit
  } = useForm<AddPurchaseProductInput>({
    resolver: zodResolver(addPurchaseProductSchema),
    defaultValues: {
      name: "",
      category: undefined,
      unit_type: undefined,
      quantity: "",
      value: "",
      checked: false
    }
  });

  // funções
  function handleOpenDrawer() {
    setIsDrawerOpen(true);
    // Garantir que o formulário esteja limpo quando abrir
    reset({
      name: "",
      category: undefined,
      unit_type: undefined,
      quantity: "",
      value: "",
      checked: false
    });
  }

  function onSubmit(data: AddPurchaseProductInput) {
    startAddProductTransition(async () => {
      // Validar e transformar os dados usando o schema
      const validatedData = addPurchaseProductSchema.parse(data);
      
      // O refine garante que category e unit_type não sejam undefined
      const item: IProductProps = {
        id: crypto.randomUUID() as string,
        name: validatedData.name,
        category: validatedData.category as ItemCategories,
        unit_type: validatedData.unit_type as UnitTypes,
        quantity: validatedData.quantity ?? 0,
        value: validatedData.value ?? 0,
        checked: validatedData.checked ?? false
      };

      try {

        await addPurchaseItem(productsList?.id as string, item);
        
        sendToastMessage({
          title: "Produto adicionado com sucesso!",
          type: "success"
        });

        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.productsList, productsList?.id] });

        // Reset do formulário e fechamento do drawer
        reset({
          name: "",
          category: undefined,
          unit_type: undefined,
          quantity: "",
          value: "",
          checked: false
        });
        setIsDrawerOpen(false);
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
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button
          disabled={isButtonDisabled}
          onClick={handleOpenDrawer}
          size="sm"
          className="fixed rounded-full bottom-5 right-5 h-fit px-4 py-2"
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
              {errors.unit_type && <span className='text-xs text-red-500'>
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
                className="w-4 h-4 accent-app-primary bg-app-background border-1 border-paragraph rounded checked:border-transparent"
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
