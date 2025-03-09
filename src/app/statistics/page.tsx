"use client";
import Header from "@/components/Header";
import LoggedLayout from "@/components/layout/MainLayout";
import { MONTHS } from "@/constants/months";
import { PurchasesContext } from "@/context/PurchasesContext";
import { IFilterProps } from "@/types";
import { useContext, useEffect, useState } from "react";

export default function Statistics() {

    const { purchasesList, filterPurchases } = useContext(PurchasesContext);
    const [filterStates, setFilterStates] = useState<IFilterProps>({
        month: 0,
        year: new Date().getFullYear(),
    })

    console.log(purchasesList)

    useEffect(() => {
        filterPurchases(filterStates);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStates]);

    return (
        <LoggedLayout>
            <Header
                content={(_) => (
                    <div className='flex items-center gap-3 cursor-pointer overflow-hidden'>
                        <h2 className="text-titledark text-lg">Estatísticas</h2>
                    </div>
                )}
            />
            <main className='main-container py-28 px-5 flex flex-col gap-10'>
                <section className="grid gap-2">
                    <div>
                        <p className="text-paragraphdark font-bold mb-3">Resumo de:</p>
                        <div className="flex items-center gap-3">
                            <select
                                onChange={(e) => console.log(e.target.value)}
                                className='flex-1 placeholder:text-paragraphdark text-paragraphdark bg-secondary-dark rounded-sm px-3 py-2'
                            >
                                {MONTHS.map((month, index) => (
                                    <option key={month} value={index}>{month}</option>
                                ))}
                            </select>
                            <p>/</p>
                            <select
                                onChange={(e) => console.log(e.target.value)}
                                className='flex-1 placeholder:text-paragraphdark text-paragraphdark bg-secondary-dark rounded-sm px-3 py-2'
                            >
                                {MONTHS.map((month, index) => (
                                    <option key={month} value={index}>{month}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>
            </main>
        </LoggedLayout>
    )
}
