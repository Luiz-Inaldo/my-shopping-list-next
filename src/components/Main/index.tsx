'use client'
import React, {
  useContext,
  useState,
} from "react";
import { ChevronUp, ShoppingBagIcon } from "lucide-react";
import { AddProductForm } from "@/components/Forms/AddProductForm";
import { ProductsContext } from "@/context/ProductsContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import NonPurchaseList from "../NonPurchaseList";
import ShoppingList from "../ShoppingList";

const Main = () => {
  const {
    data,
    stipulatedValue,
    situation,
    totalValue
  } = useContext(ProductsContext);
  
  const [showFooter, setShowFooter] = useState<boolean>(false);
  const { purchaseActive, setPurchase } = useLocalStorage();

  return (
    <React.Fragment>
      <main
        className={`flex flex-col items-center py-3 ${showFooter ? "mb-96" : "mb-10"
          }`}
      >
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

        {(data.length === 0 && !purchaseActive) ? (
          <NonPurchaseList setPurchase={setPurchase} />
        ) : (
          <ShoppingList />
        )}
      </main>

      {purchaseActive && (
        <footer
          className={`fixed z-20 bottom-0 w-[430px] ${showFooter ? "translate-y-0" : "translate-y-full"
            } bg-primary-blue transition-all duration-300 flex flex-col justify-center`}
        >
          <div className="grid grid-cols-2 gap-3 px-5 py-6">
            <div className="col-span-2 flex gap-2 p-2 items-center justify-between text-title border-b border-title">
              <h3 className="flex-1">Itens comprados: </h3>
              <span className="p-1">
                {data.filter((item) => item.checked === true).length}
              </span>
            </div>

            <div className="col-span-2 flex gap-2 p-2 items-center text-title border-b border-title">
              <h3 className="flex-1">Valor Total: </h3>
              <span className="p-1">R$ {totalValue}</span>
            </div>

            <div className="col-span-2 flex gap-2 p-2 items-center text-title border-b border-title">
              <h3 className="flex-1">Gasto Estipulado: </h3>
              <span className="p-1">{`${stipulatedValue !== "não definido"
                ? `R$ ${stipulatedValue}`
                : "não definido"
                }`}</span>
            </div>

            <div className="col-span-2 flex gap-2 p-2 items-center text-title border-b border-title">
              <h3 className="flex-1">Situação: </h3>
              <span
                className={`py-1 px-3 rounded ${situation === "good" && "bg-green-100"
                  } ${situation === "normal" && "bg-yellow-400"} ${situation === "bad" && "bg-red-400"
                  }`}
              >
                {situation === "good" && "Boa"}
                {situation === "normal" && "Atenção ao valor total"}
                {situation === "bad" && "Valor atingido"}
              </span>
            </div>
          </div>

          {/* add item button */}
          <AddProductForm />
          {/* end add item button */}

          {/* finish purchase button */}
          <div
            onClick={() => console.log("compra fechada")}
            className="mb-5 bg-[#FF7F50] rounded-full w-fit mx-auto px-3 py-2 flex gap-2 items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out text-white"
          >
            <ShoppingBagIcon className="svg-shadow" size={20} />
            <span className="text-shadow-base">Finalizar Compra</span>
          </div>
          {/* end finish purchase button */}

          {/* toggleButton */}
          <div
            onClick={() => setShowFooter(!showFooter)}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary-blue rounded-lg flex items-start justify-center cursor-pointer"
          >
            <ChevronUp
              className={`text-title ${showFooter ? "rotate-180" : ""
                } transition-transform duration-300`}
            />
          </div>
          {/* end toggleButton */}
        </footer>
      )}
    </React.Fragment>
  );
};

export default Main;
