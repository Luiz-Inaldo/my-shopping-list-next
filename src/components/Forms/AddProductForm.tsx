"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { ShadSelect } from "../Select";
import { SelectItem } from "../ui/select";
import { CATEGORIES } from "@/constants/categories";
import { supabase } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "../ui/toast";
import { ProductsContext } from "@/context/ProductsContext";
import { IFormItem } from "@/types";
import useGeneralUserStore from "@/store/generalUserStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

export const AddProductForm = () => {
  const user = useGeneralUserStore((store) => store.user);

  const { toast } = useToast();
  const { fetchData } = useContext(ProductsContext);
  const form = useForm<IFormItem>();

  // funções
  async function onSubmit(data: IFormItem) {
    const item = {
      ...data,
      user_id: user?.id,
    };
    if (item.value === "") {
      item.value = "0,00";
    }

    try {
      const response = await supabase.from("products").insert([item]).select();

      if (response.status === 201) {
        toast({
          description: "Produto adicionado com sucesso.",
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        });

        fetchData();
      } else {
      }

      form.reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Drawer>
      <DrawerTrigger className="relative flex items-center justify-center">
        {/* <span className='absolute w-8 h-8 top-1.5 animate-ping z-[-1] bg-primary-blue rounded-full'></span> */}
        <Button
          onClick={() => {}}
          size="icon"
          className="rounded-full cursor-pointer shadow-md p-0 text-2xl"
        >
          <Plus className="svg-shadow" size={24} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-app-container rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DrawerHeader>
              <DrawerTitle>Adicionar novo produto</DrawerTitle>
              <DrawerDescription>
                Preencha as informações abaixo
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-5 p-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do produto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome do produto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <ShadSelect
                        control={form.control}
                        label="Escolha a categoria"
                        name="category"
                      >
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </ShadSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="0,00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="checked"
                render={({ field }) => (
                  <FormItem className="space-y-0 flex items-center gap-3">
                    <FormLabel>Já adquirido?</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DrawerFooter>
              <Button type="submit" className="w-full">
                Adicionar
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
