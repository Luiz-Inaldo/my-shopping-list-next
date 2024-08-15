"use client";
import React, { useContext, useState } from "react";
import { EllipsisVertical, Search } from "lucide-react";
import { AddProductForm } from "@/components/Forms/AddProductForm";
import { CATEGORIES } from "@/constants/constants";
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/toaster"
import { ProductsContext } from "@/context/ProductsContext";
import { EditProductForm } from "@/components/Forms/EditProductForm";

export default function Home() {

  const { data, loading, optionMenu,
    editFormOpen, setEditFormOpen,
    setOptionMenu, formatNumber, handleDeleteItem
  } = useContext(ProductsContext);

  return (
    <React.Fragment>
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
          {CATEGORIES.map((category) => {

            const products = data.filter((product) => product.category === category.name);

            return (
              <div key={category.name} className="flex flex-col gap-4 w-full rounded p-2 bg-snow">
                <div className="flex items-center gap-4 text-subtitle">
                  <category.icon />
                  <span className="text-lg">
                    {category.name}
                  </span>
                </div>
                {loading ? (
                  <div className="flex flex-col gap-2 ml-5">
                    <Skeleton className="w-36 h-4" />
                    <Skeleton className="w-80 h-4" />
                  </div>
                ) : (
                  <>
                    {products.length > 0 ? (
                      <React.Fragment>
                        {products.map(item => (
                          <div key={item.name} className="flex flex-col gap-4 ml-5">
                            <div className="relative flex flex-col gap-2 text-paragraph">
                              <div className="flex items-center">
                                <label htmlFor={item.name} className="flex-1 flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={item.checked}
                                    id={item.name}
                                    className="w-4 h-4 accent-primary-green border-2 border-paragraph rounded"
                                  />
                                  <span className="max-w-60">{item.name}</span>
                                </label>
                                <div
                                  className="relative w-6 h-6 rounded-full flex items-center justify-center cursor-pointer">
                                  <EllipsisVertical
                                    size={16}
                                    onClick={() => setOptionMenu(item.id)}
                                  />
                                  {optionMenu === item.id && (
                                    <>
                                      <div className='absolute z-10 py-1 right-7 rounded shadow border border-gray-200 bg-snow grid gap-1'>
                                        <span
                                          className='px-3 text-paragraph'
                                          onClick={() => {
                                            setOptionMenu(null);
                                            setEditFormOpen(true);
                                          }}>
                                          Editar
                                        </span>
                                        <hr />
                                        <span 
                                        className='px-3 text-paragraph'
                                        onClick={() => handleDeleteItem(item.id)}>
                                          Excluir
                                        </span>
                                      </div>
                                    </>
                                  )}
                                  <EditProductForm item={item} editFormOpen={editFormOpen} setEditFormOpen={setEditFormOpen} />
                                </div>
                              </div>
                              <div className="flex gap-4">
                                <span>qntd: {item.quantity}</span>
                                <span>valor: R$ {item.value.replace('.', ',') || '0,00'}</span>
                                <span>total: R$ {formatNumber(item.value, item.quantity)}</span>
                              </div>

                            </div>
                          </div>
                        ))}
                      </React.Fragment>
                    ) : (
                      <span className="text-paragraph text-center">
                        Essa categoria não possui itens
                      </span>
                    )}
                  </>
                )}
              </div>
            )

          })}
          {/* end category list */}

          {/* add item button */}
          <AddProductForm />
          {/* end add item button */}
        </main >
        <footer className="w-full h-32 bg-primary-green flex flex-col px-10 py-8 gap-3">

          <div className="flex gap-2 items-center text-title">
            <h3>Itens comprados: </h3>
            <span>{data.filter(item => item.checked === true).length}</span>
          </div>

          <div className="flex gap-2 items-center text-title text-2xl">
            <h3>Valor Total: </h3>
            <span>R$ 0,00</span>
          </div>

        </footer>
      </div >
      <Toaster />
    </React.Fragment>
  );
}
