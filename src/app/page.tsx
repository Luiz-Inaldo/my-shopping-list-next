import React from "react";
import LoggedLayout from "@/components/layout/MainLayout";
import { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { PurchasesProvider } from "@/context/PurchasesContext";

export const metadata: Metadata = {
  title: "EzShop | Página inicial",
  description: "Acompanhe sua lista de compras",
  openGraph: {
    title: "EzShop | Página inicial",
    description: "Acompanhe sua lista de compras",
  }
};

export default function Home() {

  return (
    <>
      <LoggedLayout>
        <PurchasesProvider>
          <HomePage />
        </PurchasesProvider>
      </LoggedLayout>
    </>
  );
}
