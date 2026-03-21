"use client";
import ReactDOM from 'react-dom';
import React, { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { NewListProps } from '@/types/purchaseList';
import { sleep } from '@/functions/sleep';
import { Input } from '../ui/input';
import { Check, Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListSchema } from '@/zodSchema/createList';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { motion } from 'motion/react';
import { IPurchaseProps } from '@/types';
import { addPurchaseToDb } from '@/services/purchasesListServices';
import { invalidateAllQueries } from '@/functions/invalidadeQueries';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Timestamp } from 'firebase/firestore';
import useGeneralUserStore from '@/store/generalUserStore';
import { AppLoader } from '../Loader/app-loader';
import { Button } from '../ui/button';

const addButtonVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay: 1 },
} as const;


const NewListForm = () => {
  const user = useGeneralUserStore((s) => s.userProfile);
  const [isSettingPurchase, setPurchaseTransition] = useTransition();
  const isLocked = user ? !user?.emailVerified : false;

  const [open, setOpen] = useState(false);

  const form = useForm<NewListProps>({
    resolver: zodResolver(createListSchema),
  });

  const onSubmit = async (listData: NewListProps) => {
    const newList: IPurchaseProps = {
      title: listData.list_name,
      is_active: true,
      start_date: Timestamp.fromDate(new Date()),
      end_date: null,
      total_price: 0,
      purchase_items: [],
      max_value: parseFloat(listData.list_max_value.replace(',', '.')),
      user_id: user?.uid,
    };

    setPurchaseTransition(async () => {
      await sleep(2);

      try {
        await addPurchaseToDb(newList);
        sendToastMessage({
          title: 'Lista criada com sucesso!',
          type: 'success',
        });
        if (user) {
          invalidateAllQueries([[QUERY_KEYS.purchases, user?.uid]]);
        }
      } catch (error) {
        console.error(error);
        sendToastMessage({
          title: 'Erro ao criar compra! Tente novamente.',
          type: 'error',
        });
      }

      setOpen(false);
    });
  };

  return ReactDOM.createPortal(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          disabled={isLocked}
          variants={addButtonVariants}
          initial="initial"
          animate="animate"
          transition={addButtonVariants.transition}
          className="fixed bottom-[80px] right-2.5 z-[5] flex h-12 min-h-12 items-center gap-2 rounded-sketch-wobbly border-2 border-sketch-border bg-sketch-yellow px-7 font-sketch text-lg font-bold text-title shadow-sketch transition-[transform,box-shadow] duration-100 hover:-rotate-1 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-sketch-2 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Nova lista</span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="p-0" onClick={(e) => e.stopPropagation()}>
        <DialogHeader className="space-y-2 px-6 pb-2 pt-8 text-center sm:text-center">
          <DialogTitle className="font-sketchHeading text-xl font-bold leading-tight text-title">
            Criar nova lista
          </DialogTitle>
        </DialogHeader>
        <DialogDescription hidden />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full place-items-stretch gap-5 px-6 pb-6 pt-2"
          >
            <div className="flex w-full flex-col gap-5">
              <FormField
                control={form.control}
                name="list_name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-sketch text-[15px] font-bold text-title">
                      Nome da lista
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira o nome"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-sketch text-[13px] text-sketch-danger" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="list_max_value"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-sketch text-[15px] font-bold text-title">
                      Valor máximo da lista
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira o valor máximo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-sketch text-[13px] text-sketch-danger" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isSettingPurchase}
              className="w-full text-lg"
            >
              {isSettingPurchase ? (
                <>
                  <AppLoader size={20} />
                  <span>Criando lista...</span>
                </>
              ) : (
                <>
                  <Check size={20} strokeWidth={2.5} />
                  <span>Criar nova lista</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>,
    document.body,
  );
};

export default NewListForm;
