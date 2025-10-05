import { IPurchaseProps } from "@/types";
import { HistoricPurchaseItemSkeleton } from "./HistoricPurchaseItemSkeleton";
import Image from "next/image";
import React from "react";
import { HistoricPurchaseItem } from "./HistoricPurchaseItem";
import ErrorFetchData from "@/components/Errors/ErrorFetchData";

interface THistoricListProps {
    isLoading: boolean;
    hasError: boolean;
    data: IPurchaseProps[];
    retryFn: () => void;
    isFetching: boolean;
}

export function HistoricList({ isLoading, hasError, data, retryFn, isFetching }: THistoricListProps) {

    if (isLoading || !data) {
        return (
            <>
                {Array.from({ length: 3 }).map((_, index) => (
                    <HistoricPurchaseItemSkeleton key={index} />
                ))}
            </>
        )
    }

    if (hasError) {
        return <ErrorFetchData retryFn={retryFn} isRetrying={isFetching} />
    }

    if (data.length === 0) {
        return (
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
        )
    }

    return (
        <div className="space-y-5">
            <p className="text-paragraph text-sm">
                Exibindo {data.length} {data.length === 1 ? 'resultado' : 'resultados'}
            </p>
            {data.map((purchase) => (
                <HistoricPurchaseItem key={purchase.id} purchase={purchase} />
            ))}
        </div>
    )
}
