"use client";
import { supabase } from "@/lib/api";
import { IPurchaseProps } from "@/types";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoggedLayout from "@/components/layout/MainLayout";
import Header from "@/components/Header";
import Link from "next/link";
import { APP_ROUTES } from "@/routes/app-routes";
import { CATEGORIES } from "@/constants/categories";
import { calculatePercentage } from "@/functions/categoryPercentage";

export default function HistoricPage() {
  const params = useParams();
  const { title } = params;
  const decodedTitle = decodeURIComponent(title as string);

  const [purchase, setPurchase] = useState<IPurchaseProps>({
    id: "",
    title: "",
    purchase_date: "",
    purchase_items: "",
    total_price: "",
    user_id: "",
  });

  //chamada para a api do supabase
  useEffect(() => {
    const fetchPurchase = async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("title", decodedTitle)
        .single();
      if (error) {
        console.error(error);
      } else {
        setPurchase({
            id: data.id,
            title: data.title,
            purchase_date: data.purchase_date,
            purchase_items:
              typeof data.purchase_items === "string"
                ? JSON.parse(data.purchase_items)
                : data.purchase_items,
            total_price: data.total_price,
            user_id: data.user_id,
        });
      }
    };
    fetchPurchase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LoggedLayout>
        <Header
          content={(_: any) => (
            <div className="flex gap-3 items-center">
              <Link href={APP_ROUTES.private.historic.name}>
                <ChevronLeft size={20} className="text-title" />
              </Link>
              <h1 className="text-lg max-w-[370px] text-title text-ellipsis overflow-hidden whitespace-nowrap">
                Visualização de Histórico
              </h1>
            </div>
          )}
        />

        <div className="w-full px-5 py-[100px]">
          <div className="flex flex-col gap-10">
            <h2 className="text-lg text-subtitle font-semibold">
              {decodedTitle}
            </h2>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <h3 className="text-subtitle">Informações Gerais</h3>
                <div className="bg-app-container shadow-md border border-border p-3 rounded-md">
                  <div className="flex items-center gap-1 text-sm">
                    <p className="text-subtitle">Valor Total:</p>
                    <p className="text-paragraph font-semibold">
                      {purchase.total_price}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mb-5 text-sm">
                    <p className="text-subtitle">Data da compra:</p>
                    <p className="text-paragraph font-semibold">
                      {" "}
                      {purchase.purchase_date
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")}
                    </p>
                  </div>

                  <Link
                    href={APP_ROUTES.private.historic.details.children(
                      decodedTitle
                    )}
                    className="py-2 px-4 bg-default-green text-snow text-sm flex items-center justify-center rounded-full w-full"
                  >
                    Gerar Cupom
                  </Link>
                </div>
              </div>
              <div className="grid gap-2">
                <h3 className="text-subtitle">Estatísticas da compra</h3>
                <div className="bg-app-container shadow-md border border-border p-3 rounded-md grid gap-4">
                  {CATEGORIES.map((category) => (
                    <div key={category.name} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <category.icon
                          strokeWidth={1.5}
                          size={18}
                          className="shrink-0 text-subtitle"
                        />
                        <p className="shrink-0 text-subtitle">
                          {category.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          style={{
                            backgroundColor: category.backgroundColor,
                            width: calculatePercentage(
                              purchase.purchase_items,
                              category.name
                            ),
                          }}
                          className="h-4 rounded-md"
                        />
                        <p className="shrink-0 text-paragraph">
                          {calculatePercentage(
                            purchase.purchase_items,
                            category.name
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoggedLayout>
    </>
  );
}
