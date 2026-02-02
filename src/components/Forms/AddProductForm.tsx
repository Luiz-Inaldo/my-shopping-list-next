'use client';
import React, { useContext, useState, useTransition } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Form, FormInput, LoaderCircle, Mic, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShadSelect } from '../Select';
import { SelectItem } from '../ui/select';
import { CATEGORIES } from '@/constants/categories';
import {
  addPurchaseProductSchema,
  AddPurchaseProductInput,
} from '@/zodSchema/addPurchaseProduct';
import { ItemCategories } from '@/enums/categories';
import { UnitTypes } from '@/enums/unitTypes';
import { IProductProps } from '@/types';
import { Button } from '../ui/button';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { useShoplistContext } from '@/context/ShoplistContext';
import { addPurchaseItem } from '@/services/productsListServices';
import { queryClient } from '@/utils/queryClient';
import { QUERY_KEYS } from '@/constants/queryKeys';
import useGeneralUserStore from '@/store/generalUserStore';
import { cn } from '@/lib/utils';
import { useSpeech } from '@/hooks/useSpeech';
import { parseCommand } from '@/functions/voiceCommandParser';
import { UNIT_TYPES } from '@/constants/unitTypes';
import { AnimatePresence, motion } from 'motion/react';
import { formatCurrency } from '@/functions/formatCurrency';
import { AppLoader } from '../Loader/app-loader';

type TFormMode = 'default' | 'voice';

export const AddProductForm = ({ withLabel, className }: { withLabel?: boolean; className?: string }) => {
  const user = useGeneralUserStore((s) => s.userProfile);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formMode, setFormMode] = useState<TFormMode>('default');
  const [speechResults, setSpeechResults] = useState<Record<string, any>>({
    output: '',
    result: {} as AddPurchaseProductInput
  });
  const [isLoading, startAddProductTransition] = useTransition();
  const isButtonDisabled = user ? !user.emailVerified : false;

  const { productsList } = useShoplistContext();

  const { isListening, startListening, stopListening } = useSpeech((text) => {
    console.log(text)
    const parsed = parseCommand(text)
    console.log(parsed)
    setSpeechResults({
      output: text,
      result: parsed
    });
    reset({
      name: parsed.name,
      category: parsed.category,
      unit_type: parsed.unit_type,
      quantity: parsed.quantity,
      value: parsed.value,
      checked: parsed.checked,
    })
  });

  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<AddPurchaseProductInput>({
    resolver: zodResolver(addPurchaseProductSchema),
    defaultValues: {
      name: '',
      category: undefined,
      unit_type: undefined,
      quantity: '',
      value: '',
      checked: false,
    },
  });

  // funções
  function handleOpenDrawer() {
    setIsDrawerOpen(true);
    // Garantir que o formulário esteja limpo quando abrir
    reset({
      name: '',
      category: undefined,
      unit_type: undefined,
      quantity: '',
      value: '',
      checked: false,
    });
  }

  function resetSpeechResults() {
    setSpeechResults({
      output: '',
      result: {} as AddPurchaseProductInput
    })
  }

  function resetFormValues() {
    reset({
      name: '',
      category: undefined,
      unit_type: undefined,
      quantity: '',
      value: '',
      checked: false,
    });
    resetSpeechResults()
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
        checked: validatedData.checked ?? false,
      };

      try {
        await addPurchaseItem(productsList?.id as string, item);

        sendToastMessage({
          title: 'Produto adicionado com sucesso!',
          type: 'success',
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.productsList, productsList?.id],
        });

        // Reset do formulário e fechamento do drawer
        resetFormValues();
        setIsDrawerOpen(false);
      } catch (error) {
        sendToastMessage({
          title: 'Erro ao adicionar produto',
          type: 'error',
        });
        console.error('Error adding product:', error);
      }
    });
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button
          disabled={isButtonDisabled}
          onClick={handleOpenDrawer}
          size="sm"
          className={cn("h-fit p-1 gap-2 rounded-lg", className)}
        >
          <Plus size={20} />
          {withLabel && 'Adicionar Produto'}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-app-container rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <DrawerHeader>
            <DrawerTitle>Adicionar novo produto</DrawerTitle>
            <DrawerDescription>Preencha o formulário abaixo</DrawerDescription>
          </DrawerHeader>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setFormMode(formMode === 'default' ? 'voice' : 'default')}
            className="absolute top-2 right-2 hover:bg-transparent"
          >
            {formMode === 'default' ? <Mic /> : <Form />}
          </Button>
          <div className={cn("flex w-[200%] h-full   transition-all duration-300",
            formMode === 'default' ? 'translate-x-0' : '-translate-x-1/2'
          )}>
            <div className="w-1/2">
              <div className="flex flex-col gap-5 p-5">
                <label htmlFor="name" className="relative flex flex-col">
                  <span className="text-subtitle text-sm font-semibold mb-1 leading-none">
                    Nome do produto:
                  </span>
                  <input
                    type="text"
                    placeholder="Digite o nome do produto"
                    className="w-full flex h-8 rounded-full border text-subtitle border-gray-300 bg-app-background px-3 py-2 text-sm"
                    {...register('name', { required: true })}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500">Campo obrigatório</span>
                  )}
                </label>

                <label
                  htmlFor="category"
                  className="relative flex flex-col col-span-1"
                >
                  <span className="text-subtitle text-sm font-semibold mb-1 leading-none">
                    Categoria:
                  </span>
                  <ShadSelect
                    control={control}
                    label="Escolha a categoria"
                    name="category"
                  >
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </ShadSelect>
                  {errors.category && (
                    <span className="text-xs text-red-500">Campo obrigatório</span>
                  )}
                </label>

                <label
                  htmlFor="unit_type"
                  className="relative flex flex-col col-span-1"
                >
                  <span className="text-subtitle text-sm font-semibold mb-1 leading-none">
                    Tipo de unidade:
                  </span>
                  <ShadSelect
                    control={control}
                    label="Selecione o tipo de unidade"
                    name="unit_type"
                  >
                    {UNIT_TYPES.map((type: { label: string; value: string }) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </ShadSelect>
                  {errors.unit_type && (
                    <span className="text-xs text-red-500">Campo obrigatório</span>
                  )}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label
                    htmlFor="quantity"
                    className="relative flex flex-col col-span-1"
                  >
                    <span className="text-subtitle text-sm font-semibold mb-1 leading-none">
                      Quantidade:
                    </span>
                    <input
                      type="text"
                      placeholder="0"
                      className="w-full flex h-8 rounded-full border text-subtitle border-gray-300 bg-app-background px-3 py-2 text-sm"
                      {...register('quantity')}
                    />
                    {errors.quantity && (
                      <span className="text-xs text-red-500">
                        Campo obrigatório
                      </span>
                    )}
                  </label>

                  <label htmlFor="value" className="relative flex flex-col">
                    <span className="text-subtitle text-sm font-semibold mb-1 leading-none">
                      Valor:
                    </span>
                    <input
                      type="text"
                      placeholder="0,00"
                      className="w-full flex h-8 rounded-full border text-subtitle border-gray-300 bg-app-background px-3 py-2 text-sm"
                      {...register('value')}
                    />
                  </label>
                </div>

                <label
                  htmlFor="checked"
                  className="relative flex items-center gap-5"
                >
                  <span className="text-subtitle text-sm font-semibold mb-1 leading-none">
                    Já adquirido?
                  </span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-app-primary bg-app-background border-1 border-paragraph rounded checked:border-transparent"
                    {...register('checked')}
                  />
                </label>
              </div>
              <DrawerFooter>
                <Button type="submit">
                  {isLoading ? (
                    <>
                      <LoaderCircle className="animate-spin" size={16} />
                      Adicionando produto...
                    </>
                  ) : (
                    'Adicionar produto'
                  )}
                </Button>
              </DrawerFooter>
            </div>
            <div className="w-1/2 flex flex-col items-center">
              <AnimatePresence mode="wait">
                {!speechResults.output ? (
                  <motion.div
                    key="voice-input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full my-auto"
                  >
                    <div
                      onClick={
                        isListening ? stopListening : startListening
                      }
                      className="relative mx-auto flex items-center justify-center bg-app-container rounded-full size-16 border border-border">
                      {isListening && (
                        <div className="absolute animate-ping size-[70%] rounded-full -z-[1] bg-destructive opacity-75" />
                      )}
                      <Mic size={48} className={cn("text-subtitle", isListening && "text-destructive")} />
                    </div>
                    <p className="text-subtitle text-center mt-5">{
                      isListening ? 'Escutando... Toque para finalizar' : 'Toque para falar'
                    }</p>
                    <p
                      className={cn("text-paragraph max-w-xs mx-auto italic text-center text-sm mt-10 transition-opacity duration-200",
                        isListening && "opacity-0"
                      )}
                    >
                      Exemplo de comando: "Duas unidades de leite por 2,50"
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="voice-result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full mt-1 p-4 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-10">
                      <h2 className="text-base text-center font-semibold p-2.5 rounded-lg bg-app-primary/10">
                        "{speechResults?.output}"
                      </h2>
                      <div className="space-y-2 text-sm">
                        <p className="text-base text-subtitle font-medium">Revise o item para adicionar:</p>
                        <div className="flex justify-between">
                          <p className="text-paragraph">Nome:</p>
                          <p className="text-subtitle font-medium">{speechResults?.result?.name}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-paragraph">Quantidade:</p>
                          <p className="text-subtitle font-medium">{speechResults?.result?.quantity}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-paragraph">Tipo de unidade:</p>
                          <p className="text-subtitle font-medium">{speechResults?.result?.unit_type}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-paragraph">Categoria:</p>
                          <p className="text-subtitle font-medium">{speechResults?.result?.category}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-paragraph">Valor:</p>
                          <p className="text-subtitle font-medium">{formatCurrency(Number(speechResults?.result?.value) || 0)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        onClick={resetFormValues}
                        variant="ghost"
                      >
                        Cancelar
                      </Button>
                      <Button
                        disabled={isLoading}
                        type="submit"
                      >
                        {isLoading ? <AppLoader size={16} /> : 'Adicionar'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
