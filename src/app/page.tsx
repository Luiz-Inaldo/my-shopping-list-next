import React from "react";
import LoggedLayout from "@/components/layout/MainLayout";
import Main from "@/components/Main";
import { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  title: "EzShop | Lista",
  description: "Acompanhe sua lista de compras",
  openGraph: {
    title: "EzShop | Lista",
    description: "Acompanhe sua lista de compras",
  }
};

export default function Home() {

  return (
    <>
      <LoggedLayout>
        <HomePage />
      </LoggedLayout>
    </>
  );
}
