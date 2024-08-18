"use client";
import React, { Suspense, useContext, useEffect, useRef, useState } from "react";
import { ChevronUp, EllipsisVertical, RotateCcw, Search } from "lucide-react";
import { AddProductForm } from "@/components/Forms/AddProductForm";
import { CATEGORIES } from "@/constants/constants";
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/toaster"
import { ProductsContext } from "@/context/ProductsContext";
import { IProductProps } from "@/types/product";
import { Modal } from "@/components/Modal";

export default function Home() {

  const { data, loading, optionMenu,
    stipulatedValue, setModal,
    situation, deleteAllItems,
    totalValue, handleDismarkItem, handleCheckItem,
    setOptionMenu, formatNumber, handleDeleteItem
  } = useContext(ProductsContext);
  const [item, setItem] = useState<IProductProps>({
    id: 0,
    name: '',
    category: '',
    quantity: 0,
    value: '',
    checked: false
  });
  const [showFooter, setShowFooter] = useState<boolean>(false);

  /* ----> refs <----- */
  const dropDownRef = useRef<any>(null);

  /* ----> function <----- */
  const handleItemCheckbox = (item: IProductProps) => {

    if (!item.checked && item.value === '0,00') {
      setModal({
        state: "OPEN",
        type: "CHECK_PRODUCT"
      });
      setItem(item);
    } else if (!item.checked && item.value !== '0,00') {
      handleCheckItem(item);
    } else if (item.checked) {
      handleDismarkItem(item);
    }

  }

  /* -----> Effects <----- */
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (optionMenu === null) return;
      if (dropDownRef?.current?.contains(target)) return;
      setOptionMenu(null);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  return (
    <React.Fragment>
      <div className="flex flex-col gap-10 w-[430px] mx-auto bg-gray-background">
        <header className="relative w-full h-[120px] bg-primary-green flex flex-col items-center justify-center shadow-md">
          <h1 className="text-3xl uppercase font-bold text-title">
            Minha lista de compras
          </h1>
          <p className="text-xs text-title self-end mr-10">(v1)</p>
        </header>
        <main className={`flex flex-col items-center gap-5 px-5 py-3 ${showFooter ? 'mb-96' : 'mb-10'}`}>
          {/* <div className="w-full flex gap-3 items-center mb-5">
            <Search
              className="text-subtitle"
              size={24}
            />
            <input
              type="text"
              placeholder="Buscar produto..."
              className="w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8"
            />
          </div> */}

          <div 
            onClick={() => deleteAllItems()}
            className="flex items-center justify-center gap-2 self-start">
            <RotateCcw size={16} />
            <span>Resetar lista</span>
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
                          <div key={item.name} className='flex flex-col gap-4 ml-5 p-1 rounded'>
                            <div className={`relative flex flex-col gap-2 ${item.checked ? '!text-green-600' : 'text-paragraph'}`}>
                              <div className="flex items-center">
                                <label htmlFor={item.name} className="flex-1 flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={item.checked}
                                    id={item.name}
                                    onClick={() => handleItemCheckbox(item)}
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
                                      <div ref={dropDownRef} className='absolute z-10 py-1 right-7 rounded shadow border border-gray-200 bg-snow grid gap-1'>
                                        <span
                                          className='px-3 text-paragraph'
                                          onClick={() => {
                                            setOptionMenu(null);
                                            setModal({
                                              state: 'OPEN',
                                              type: 'EDIT_PRODUCT'
                                            });
                                            setItem(item);
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


        </main >
        <footer className={`fixed bottom-0 w-full ${showFooter ? 'translate-y-0' : 'translate-y-full'} bg-primary-green transition-all duration-300 flex flex-col justify-center`}>

          <div className="grid grid-cols-2 gap-3 px-5 py-6">
            <div className="col-span-2 flex gap-2 p-2 items-center justify-between text-title border-b border-title">
              <h3 className="flex-1">Itens comprados: </h3>
              <span className="p-1">{data.filter(item => item.checked === true).length}</span>
            </div>

            <div className="col-span-2 flex gap-2 p-2 items-center text-title border-b border-title">
              <h3 className="flex-1">Valor Total: </h3>
              <span className="p-1">R$ {totalValue}</span>
            </div>

            <div className="col-span-2 flex gap-2 p-2 items-center text-title border-b border-title">
              <h3 className="flex-1">Gasto Estipulado: </h3>
              <span className="p-1">{`${stipulatedValue !== 'não definido' ? `R$ ${stipulatedValue}` : 'não definido'}`}</span>
            </div>

            <div className="col-span-2 flex gap-2 p-2 items-center text-title border-b border-title">
              <h3 className="flex-1">Situação: </h3>
              <span className={`py-1 px-3 rounded ${situation === 'good' && 'bg-green-100'} ${situation === 'normal' && 'bg-yellow-400'} ${situation === 'bad' && 'bg-red-400'}`}>
                {situation === 'good' && 'Boa'}
                {situation === 'normal' && 'Atenção ao valor total'}
                {situation === 'bad' && 'Valor atingido'}
              </span>
            </div>
          </div>

          {/* add item button */}
          <AddProductForm />
          {/* end add item button */}

          {/* toggleButton */}
          <div
            onClick={() => setShowFooter(!showFooter)}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary-green rounded-lg flex items-start justify-center cursor-pointer">
            <ChevronUp className={`text-title ${showFooter ? 'rotate-180' : ''} transition-transform duration-300`} />
          </div>
          {/* end toggleButton */}

        </footer>
        <Suspense fallback={null}>
          <Modal item={item} />
        </Suspense>
      </div >
      <Toaster />
    </React.Fragment>
  );
}
