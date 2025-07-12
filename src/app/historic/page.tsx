"use client";
import { DeletePurchase } from '@/components/Forms/DeletePurchase';
import Header from '@/components/Header';
import LoggedLayout from '@/components/layout/MainLayout';
import { Modal } from '@/components/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MONTHS } from '@/constants/months';
import { YEARS } from '@/constants/years';
import { ProductsContext } from '@/context/ProductsContext';
import { PurchasesContext } from '@/context/PurchasesContext';
import { formatCurrency } from '@/functions/formatCurrency';
import { APP_ROUTES } from '@/routes/app-routes';
import { IFilterProps, IPurchaseProps } from '@/types';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense, useCallback, useContext, useEffect, useState } from 'react';


export default function Historic() {

    const { setModal } = useContext(ProductsContext);
    const { purchasesList, purchasesLoading, filterPurchases } = useContext(PurchasesContext);
    const [purchase, setPurchase] = useState<IPurchaseProps>({
        id: "",
        title: "",
        purchase_date: "",
        purchase_items: "",
        total_price: "",
        user_id: "",
    });
    const [filterStates, setFilterStates] = useState<IFilterProps>({
        month: "todos",
        year: "todos",
    });

    const handleOpenModal = useCallback((purchase: IPurchaseProps) => {
        setModal({
            state: "OPEN",
            type: "DELETE_PURCHASE"
        });
        setPurchase(purchase);
    }, [setModal])

    const handleFilterPurchases = (value: string, type: string) => {

        if (value === "todos") {
            setFilterStates((prev) => ({ ...prev, [type]: value }));
        } else {
            setFilterStates(prev => ({
                ...prev,
                [type]: parseInt(value)
            }));
        }

    };

    useEffect(() => {
        filterPurchases(filterStates);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStates]);

    return (
      <LoggedLayout>
        <Header
          content={(_) => (
            <h1 className="text-lg max-w-[370px] text-title text-ellipsis overflow-hidden whitespace-nowrap">
              Histórico de Compras
            </h1>
          )}
        />
        <div className="w-full px-5 py-[100px]">
          <div className="grid 2xsm:grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <p className="text-subtitle font-semibold col-span-2">
                Filtrar por:
              </p>

              <label className="relative flex-1 col-span-1">
                <span className="text-subtitle">Mês</span>
                <Select onValueChange={(value) => handleFilterPurchases(value, "month")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os meses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os meses</SelectItem>
                    {MONTHS.map((month, index) => (
                      <SelectItem key={month} value={String(index)}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="relative flex-1 col-span-1">
                <span className="text-subtitle">Ano</span>
                <Select onValueChange={(value) => handleFilterPurchases(value, "year")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os anos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os anos</SelectItem>
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            <hr className="border-border mb-5" />

            {purchasesLoading ? (
              <p className="text-center text-paragraph">
                carregando histórico...
              </p>
            ) : (
              <>
                {purchasesList?.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 mt-10">
                    <Image
                      src={"/images/feeling_blue.svg"}
                      alt="rostinho triste com mulher ao lado"
                      width={200}
                      height={150}
                    />
                    <p className="text-center text-paragraph">
                      você não possui compras registradas
                    </p>
                  </div>
                ) : (
                  <React.Fragment>
                    {purchasesList?.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="bg-app-container border border-border rounded shadow-md p-2 flex flex-col gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <div className="rounded-full bg-action w-2 h-2"></div>
                            <h2 className="text-subtitle">
                              {purchase.title}
                            </h2>
                          </div>
                          <DeletePurchase purchase={purchase} />
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <span className="text-subtitle font-semibold">
                              {formatCurrency(purchase.total_price)}
                            </span>
                            <span className="text-sm text-paragraph">
                              {purchase.purchase_date
                                .split("T")[0]
                                .split("-")
                                .reverse()
                                .join("/")}
                            </span>
                          </div>
                          <div>
                            <Link
                              href={APP_ROUTES.private.historic.details.name(
                                purchase.title
                              )}
                              className="w-fit ml-auto py-0.5 px-2 bg-default-green rounded-full flex items-center gap-1 font-medium text-xs text-snow"
                            >
                              ver detalhes
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                )}
              </>
            )}
          </div>
        </div>
        {/* <Suspense fallback={null}>
          <Modal item={purchase} />
        </Suspense> */}
      </LoggedLayout>
    );
}