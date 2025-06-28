import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Skeleton } from "../ui/skeleton";
import { CATEGORIES } from "@/constants/categories";
import { ProductsContext } from "@/context/ProductsContext";
import { IProductProps, IPurchaseProps } from "@/types";
import { Modal } from "../Modal";
import {
  Check,
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  Info,
  Search,
  ShoppingBagIcon,
  X,
} from "lucide-react";
import formatNumber from "@/functions/formatNumber";
import CategoryWrapper from "../Category";
import { formatCurrency } from "@/functions/formatCurrency";
import { supabase } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { APP_ROUTES } from "@/routes/app-routes";
import { sleep } from "@/functions/sleep";
import { Fade } from "react-awesome-reveal";
import useGeneralUserStore from "@/store/generalUserStore";
import { EditProductForm } from "../Forms/EditProductForm";
import { DeleteProduct } from "../Forms/DeleteProduct";
import { ListItemDropdown } from "../Dropdown/ListItemDropdown";
import { CheckItemForm } from "../Forms/CheckItemForm";

const ShoppingList = ({ listname }: { listname: string | undefined }) => {
  const user = useGeneralUserStore((store) => store.user);

  const {
    data,
    loadingProducts,
    setModal,
    handleCheckItem,
    handleDismarkItem,
    optionMenu,
    setOptionMenu,
    currentPurchase,
    totalValue,
    situation,
    deleteAllItems,
    deleteCurrentPurchase,
  } = useContext(ProductsContext);
  const [item, setItem] = useState<IProductProps>({
    id: "",
    name: "",
    category: "",
    quantity: 0,
    value: "",
    checked: false,
  });
  const [showPurchaseInfo, setShowPurchaseInfo] = useState<boolean>(true);
  const [savingPurchase, setSavingPurchase] = useState<{
    status: "idle" | "saving" | "success" | "error";
    progress: number;
  }>({
    status: "idle",
    progress: 0,
  });

  const router = useRouter();

  /* ----> refs <----- */
  const dropDownRef = useRef<any>(null);
  const finalizePurchaseButtonRef = useRef<HTMLButtonElement | null>(null);
  const progressBarRef = useRef<HTMLSpanElement | null>(null);

  /* ----> function <----- */
  const handleItemCheckbox = (item: IProductProps) => {
    if (!item.checked && item.value !== "0,00") {
      handleCheckItem(item);
    } else if (item.checked) {
      handleDismarkItem(item);
    }
  };

  /* ----> functions <---- */
  async function finalizePurchase() {
    setSavingPurchase((old) => ({
      status: "saving",
      progress: 0,
    }));

    const interval = setInterval(async () => {
      setSavingPurchase((old) => ({
        ...old,
        progress: old.progress + 1,
      }));
    }, 50);
    await sleep(2.5); // aguarda 2 segundos para fazer a request

    // verifica se ao menos possui um item na lista

    const currentDateMoment = new Date();

    const itemsToSave = data?.filter((item) => item.checked) || [];

    if (itemsToSave.length > 0) {
      const purchase: IPurchaseProps = {
        title: currentPurchase?.list_name || "",
        purchase_date: currentDateMoment,
        purchase_items: JSON.stringify(itemsToSave),
        total_price: totalValue,
        user_id: user?.id,
      };

      try {
        const response = await supabase
          .from("purchases")
          .insert([purchase])
          .select();

        if (response.status === 201 && progressBarRef.current) {
          progressBarRef.current.style.backgroundColor = "#09b033";

          setSavingPurchase((old) => ({
            status: "success",
            progress: 100,
          }));

          clearInterval(interval);

          await sleep(1.5);

          deleteAllItems();
          deleteCurrentPurchase();
          router.push(APP_ROUTES.private.purchase_saved.name(purchase.title)); // redireciona para outra página
        }
      } catch (error) {
        if (progressBarRef.current) {
          progressBarRef.current.style.backgroundColor = "#ff2323";
        }
      }
    } else {
      toast({
        description:
          "A compra deve ter pelo menos um item marcado para ser salva",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });

      setSavingPurchase((old) => ({
        progress: 0,
        status: "idle",
      }));

      clearInterval(interval);
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
    <>
      <h2 className="text-2xl font-bold px-4 pb-1 uppercase text-subtitle w-fit mx-auto">
        {listname && listname}
      </h2>

      <Fade triggerOnce>
        <div className="rounded-lg bg-app-container border border-border p-2 shadow-lg">
          <div
            className={`flex items-center justify-between gap-2 text-subtitle ${
              showPurchaseInfo && "mb-3"
            } transition-all duration-500`}
          >
            <div className="flex gap-2 items-center">
              <Info size={16} />
              <h3 className="font-semibold">Informações da compra</h3>
            </div>

            <div
              onClick={() => setShowPurchaseInfo(!showPurchaseInfo)}
              className="flex gap-2 items-center text-sm w-fit cursor-pointer"
            >
              {showPurchaseInfo ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          </div>

          <div
            className={`${
              showPurchaseInfo ? "max-h-[1000px]" : "max-h-0"
            } transition-all duration-500 overflow-hidden grid gap-5`}
          >
            <ul className={`flex flex-col gap-1`}>
              <li className="col-span-2 flex gap-2 items-center justify-between text-sm">
                <h3 className="flex-1 text-subtitle">Itens comprados: </h3>
                <span className="font-semibold text-subtitle">
                  {data?.filter((item) => item.checked === true).length || 0}
                </span>
              </li>

              <li className="col-span-2 flex gap-2 items-center text-sm">
                <h3 className="flex-1 text-subtitle">Valor Total: </h3>
                <span className="font-semibold text-subtitle">
                  {formatCurrency(totalValue || "0")}
                </span>
              </li>

              <li className="col-span-2 flex gap-2 items-center text-sm">
                <h3 className="flex-1 text-subtitle">Gasto Estipulado: </h3>
                <span className="font-semibold text-subtitle">
                  {formatCurrency(currentPurchase?.list_max_value || "0")}
                </span>
              </li>

              <li className="col-span-2 flex gap-2 items-center text-sm">
                <h3 className="flex-1 text-subtitle">Situação: </h3>
                <span
                  className={`py-0.5 px-2.5 text-sm rounded-full text-black ${
                    situation === "good" && "bg-green-300"
                  } ${situation === "normal" && "bg-yellow-400"} ${
                    situation === "bad" && "bg-red-400"
                  }`}
                >
                  {situation === "good" && "Boa"}
                  {situation === "normal" && "Atenção ao valor total"}
                  {situation === "bad" && "Valor atingido"}
                </span>
              </li>
            </ul>

            {/* finish purchase button */}
            <button
              ref={finalizePurchaseButtonRef}
              disabled={savingPurchase.status !== "idle"}
              onClick={finalizePurchase}
              className={`relative z-[2] mb-2 bg-secondary-blue/80 disabled:pointer-events-none min-w-56 rounded-full w-fit block mx-auto px-3 py-2 cursor-pointer shadow-md transition-all duration-500 ease-in-out text-snow overflow-hidden`}
            >
              {/* span thath represents ::before pseudo-class */}
              <span
                ref={progressBarRef}
                style={{
                  width: `${savingPurchase.progress}%`,
                  transition: "width 0.5s ease-in-out",
                }}
                className={`absolute top-0 left-0 h-full bg-secondary-blue z-0 transition-all`}
              ></span>

              <div className="relative z-[1] flex gap-2 items-center justify-center font-medium">
                {savingPurchase.status === "idle" && (
                  <>
                    <ShoppingBagIcon size={20} />
                    <span>Finalizar Compra</span>
                  </>
                )}
                {savingPurchase.status === "saving" && (
                  <>
                    <ShoppingBagIcon size={20} />
                    <span>Salvando sua compra...</span>
                  </>
                )}
                {savingPurchase.status === "success" && (
                  <>
                    <Check size={20} />
                    <span>Compra Salva!</span>
                  </>
                )}
                {savingPurchase.status === "error" && (
                  <>
                    <X size={20} />
                    <span>Erro</span>
                  </>
                )}
              </div>
            </button>
            {/* end finish purchase button */}
          </div>
        </div>
      </Fade>

      {/* search bar */}
      {/* <div className="w-full flex items-center mb-5">
                <input
                    type="text"
                    placeholder="Busque um produto específico..."
                    className="w-full placeholder:text-paragraphdark text-paragraphdark bg-secondary-dark rounded-tl-sm rounded-bl-sm px-3 py-2 h-8"
                />
                <button
                    className='rounded-tr-sm rounded-br-sm h-8 w-11 bg-secondary-blue flex items-center justify-center border border-secondary-dark'
                >
                    <Search size={16} className='text-snow' />
                </button>
            </div> */}

      {/* caregory list */}
      {CATEGORIES.map((category) => {
        const products = data?.filter(
          (product) => product.category === category.name
        );

        const ordenedProducts =
          products?.sort((a, b) => a.name.localeCompare(b.name)) || [];

        return (
          <Fade key={category.name} damping={2} cascade triggerOnce>
            <CategoryWrapper
              // key={category.name}
              activeCondition={false}
            >
              {(handleClick, open) => {
                return (
                  <div className="w-full rounded shadow">
                    <div
                      style={{
                        backgroundColor: category.backgroundColor,
                      }}
                      className={`relative z-[2] flex px-3 py-2 items-center rounded justify-between text-subtitle dark:text-snow`}
                    >
                      <div className="relative flex items-center gap-3">
                        <div
                          style={{
                            backgroundColor: category.backgroundColor,
                          }}
                          className={`absolute -top-3.5 -left-6 w-[56px] h-[56px] rounded-full flex items-center justify-center`}
                        >
                          <category.icon />
                        </div>

                        <span className="text-lg pl-12">{category.name}</span>

                        {ordenedProducts.length > 0 && (
                          <span className="italic">
                            ({ordenedProducts.length} produto(s))
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        size={20}
                        onClick={handleClick}
                        className={`${
                          open ? "rotate-180" : "rotate-0"
                        } transition-transform duration-200 cursor-pointer`}
                      />
                    </div>

                    {loadingProducts ? (
                      <div className="flex flex-col gap-2 ml-2 mt-2 p-1">
                        <Skeleton className="w-36 h-4" />
                        <Skeleton className="w-80 h-4" />
                      </div>
                    ) : (
                      <>
                        <div
                          className={`${
                            open ? "max-h-[10000px]" : "max-h-0"
                          } bg-app-container grid overflow-hidden transition-all duration-500`}
                        >
                          {ordenedProducts.length > 0 ? (
                            <React.Fragment>
                              {ordenedProducts.map((item) => (
                                <div
                                  key={item.name}
                                  className="flex flex-col gap-4 rounded"
                                >
                                  <div
                                    className={`relative rounded pl-3 py-3 flex flex-col gap-2 text-paragraph`}
                                  >
                                    <div className="flex items-center">
                                      <div className="flex-1 flex items-center gap-2">
                                        <>
                                          {!item.checked &&
                                          item.value === "0,00" ? (
                                            <CheckItemForm item={item} />
                                          ) : (
                                            <input
                                              type="checkbox"
                                              checked={item.checked}
                                              id={item.name}
                                              onClick={() =>
                                                handleItemCheckbox(item)
                                              }
                                              className="w-4 h-4 accent-primary-blue border-2 border-paragraph rounded"
                                            />
                                          )}
                                        </>
                                        <label
                                          htmlFor={item.name}
                                          className={`max-w-60 text-ellipsis overflow-hidden whitespace-nowrap ${
                                            item.checked &&
                                            "line-through italic"
                                          }`}
                                        >
                                          {item.name}
                                        </label>
                                      </div>
                                      <ListItemDropdown item={item} />
                                    </div>
                                    <div className="flex gap-4">
                                      <span>qntd: {item.quantity}</span>
                                      <span>
                                        valor: R${" "}
                                        {item.value.replace(".", ",") || "0,00"}
                                      </span>
                                      <span>
                                        total: R${" "}
                                        {formatNumber(
                                          item.value,
                                          item.quantity
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </React.Fragment>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-200 text-center mt-2">
                              Sem itens
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              }}
            </CategoryWrapper>
          </Fade>
        );
      })}
      {/* end category list */}
      <Suspense fallback={null}>
        <Modal item={item} />
      </Suspense>
    </>
  );
};

export default ShoppingList;
