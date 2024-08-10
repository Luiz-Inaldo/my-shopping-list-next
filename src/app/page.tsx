'use client';
import React from "react";
import { Plus, Search } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export default function Home() {

  const categories = Object.values(CATEGORIES);
  console.log(categories);

  return (
    <div className="flex flex-col gap-10 w-[430px] mx-auto bg-gray-background">
      <header className="w-full h-[120px] bg-primary-green flex items-center justify-center shadow-md">
        <h1 className="text-3xl uppercase font-bold text-title">
          Minha lista de compras
        </h1>
      </header>
      <main className="flex flex-col items-center gap-5 px-5 py-3">
        <div className="w-full flex gap-3 items-center mb-5">
          <Search
            className="text-subtitle"
            size={24}
          />
          <input
            type="text"
            placeholder="Buscar produto..."
            className="w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8"
          />
        </div>

        <h2 className="text-2xl text-subtitle font-bold">
          Categorias
        </h2>

        {/* caregory list */}
        {categories.map((category) => (
          <div className="flex flex-col gap-4 w-full rounded p-2 bg-snow">
            <div className="flex items-center gap-4 text-subtitle">
              <category.icon />
              <span className="text-lg">
                {category.name}
              </span>
            </div>
            {/* <div className="flex flex-col gap-4 ml-20">
            </div> */}
            <span className="text-paragraph text-center">
              Essa categoria não possui itens
            </span>
          </div>
        ))}
        {/* end category list */}

      </main>
      <footer className="relative w-full h-32 bg-primary-green flex flex-col px-10 py-8 gap-3">

        {/* add item button */}
        <div className="absolute w-[60px] h-[60px] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary-green rounded-full flex items-center justify-center cursor-pointer shadow-md">
          <Plus className="text-snow" size={32} />
        </div>
        {/* end add item button */}

        <div className="flex gap-2 items-center text-title">
          <h3>Itens comprados: </h3>
          <span>0</span>
        </div>

        <div className="flex gap-2 items-center text-title text-2xl">
          <h3>Valor Total: </h3>
          <span>R$ 0,00</span>
        </div>

      </footer>
    </div>
  );
}
