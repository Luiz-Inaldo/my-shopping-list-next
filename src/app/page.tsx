"use client";
import { ProductsProvider } from "@/context/ProductsContext";
import { MainApp } from "@/components/Main";

export default function Home() {

  return (
    <ProductsProvider>
      <MainApp />
    </ProductsProvider>
  );
}
