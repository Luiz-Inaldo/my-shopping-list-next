import React from "react";
import LoggedLayout from "@/components/layout/LoggedLayout";
import Main from "@/components/Main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha lista de compras",
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
