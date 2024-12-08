import React from "react";
import LoggedLayout from "@/components/layout/MainLayout";
import Main from "@/components/Main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha lista | Lista",
  description: "Acompanhe sua lista de compras",
  openGraph: {
    title: "Minha lista | Lista",
    description: "Acompanhe sua lista de compras",
  }
};

export default function Home() {

  return (
    <>
      <LoggedLayout>
        <Main />
      </LoggedLayout>
    </>
  );
}
