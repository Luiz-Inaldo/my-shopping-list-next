import React, { Suspense, useContext, useEffect, useRef, useState } from 'react'
import { Skeleton } from '../ui/skeleton';
import { CATEGORIES } from '@/constants/categories';
import { ProductsContext } from '@/context/ProductsContext';
import { IProductProps, IPurchaseProps } from '@/types';
import { Modal } from '../Modal';
import { Check, ChevronDown, ChevronUp, EllipsisVertical, Info, Search, ShoppingBagIcon, X } from 'lucide-react';
import formatNumber from '@/functions/formatNumber';
import CategoryWrapper from '../Category';
import { formatCurrency } from '@/functions/formatCurrency';
import { supabase } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { APP_ROUTES } from '@/routes/app-routes';
import { sleep } from '@/functions/sleep';
import { Fade } from "react-awesome-reveal";

const ShoppingList = ({ listname }: { listname: string | undefined }) => {

    const { data, user, loadingProducts, setModal, handleCheckItem, handleDismarkItem,
        optionMenu, setOptionMenu, currentPurchase, totalValue, situation,
        deleteAllItems, deleteCurrentPurchase,
    } = useContext(ProductsContext);
    const [item, setItem] = useState<IProductProps>({
        id: '',
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
        progress: 0
    });

    const router = useRouter();

    /* ----> refs <----- */
    const dropDownRef = useRef<any>(null);
    const finalizePurchaseButtonRef = useRef<HTMLButtonElement | null>(null);
    const progressBarRef = useRef<HTMLSpanElement | null>(null);

    /* ----> function <----- */
    const handleItemCheckbox = (item: IProductProps) => {
        if (!item.checked && item.value === "0,00") {
            setModal({
                state: "OPEN",
                type: "CHECK_PRODUCT",
            });
            setItem(item);
        } else if (!item.checked && item.value !== "0,00") {
            handleCheckItem(item);
        } else if (item.checked) {
            handleDismarkItem(item);
        }
    };

    /* ----> functions <---- */
    async function finalizePurchase() {

        setSavingPurchase(old => ({
            status: "saving",
            progress: 0
        }));

        const interval = setInterval(async () => {
            setSavingPurchase((old) => ({
                ...old,
                progress: old.progress + 1
            }));
        }, 50)
        await sleep(2.5); // aguarda 2 segundos para fazer a request

        // verifica se ao menos possui um item na lista

        const currentDateMoment = new Date();

        const itemsToSave = data?.filter(item => item.checked) || [];

        if (itemsToSave.length > 0) {

            const purchase: IPurchaseProps = {
                title: currentPurchase?.list_name || '',
                purchase_date: currentDateMoment,
                purchase_items: JSON.stringify(itemsToSave),
                total_price: totalValue,
                user_id: user.id
            }

            try {

                const response = await supabase.from("purchases").insert([purchase]).select();

                if (response.status === 201 && progressBarRef.current) {

                    progressBarRef.current.style.backgroundColor = "#09b033";

                    setSavingPurchase(old => ({
                        status: "success",
                        progress: 100
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
                description: "A compra deve ter pelo menos um item marcado para ser salva",
                action: <ToastAction altText="Ok">Ok</ToastAction>
            });

            setSavingPurchase(old => ({
                progress: 0,
                status: "idle"
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
            <h2 className='text-2xl font-bold px-4 pb-1 uppercase text-subtitledark w-fit mx-auto'>
                {listname && listname}
            </h2>

            <Fade triggerOnce>
                <div className='rounded bg-secondary-dark p-2 shadow'>
                    <div className={`flex items-center justify-between gap-2 text-subtitledark ${showPurchaseInfo && "mb-3"} transition-all duration-500`}>

                        <div className='flex gap-2 items-center'>
                            <Info size={16} />
                            <h3 className='font-semibold'>Informações da compra</h3>
                        </div>

                        <div
                            onClick={() => setShowPurchaseInfo(!showPurchaseInfo)}
                            className='flex gap-2 items-center text-sm w-fit cursor-pointer'
                        >
                            {showPurchaseInfo ? (
                                <ChevronUp size={16} />
                            ) : (
                                <ChevronDown size={16} />
                            )}
                        </div>
                    </div>

                    <div className={`${showPurchaseInfo ? "max-h-[1000px]" : "max-h-0"} transition-all duration-500 overflow-hidden grid gap-5`}>
                        <ul className={`flex flex-col gap-1`}>
                            <li className="col-span-2 flex gap-2 items-center justify-between text-paragraphdark">
                                <h3 className="flex-1">Itens comprados: </h3>
                                <span className="p-1 font-semibold">
                                    {data?.filter((item) => item.checked === true).length || 0}
                                </span>
                            </li>

                            <li className="col-span-2 flex gap-2 items-center text-paragraphdark">
                                <h3 className="flex-1">Valor Total: </h3>
                                <span className="p-1 font-semibold">{formatCurrency(totalValue || "0")}</span>
                            </li>

                            <li className="col-span-2 flex gap-2 items-center text-paragraphdark">
                                <h3 className="flex-1">Gasto Estipulado: </h3>
                                <span className="p-1 font-semibold">{formatCurrency(currentPurchase?.list_max_value || "0")}</span>
                            </li>

                            <li className="col-span-2 flex gap-2 items-center text-paragraphdark">
                                <h3 className="flex-1">Situação: </h3>
                                <span
                                    className={`py-1 px-3 text-sm rounded-full text-black ${situation === "good" && "bg-green-300"} ${situation === "normal" && "bg-yellow-400"} ${situation === "bad" && "bg-red-400"
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
                            className={`relative z-[2] mb-2 bg-secondary-blue/80 disabled:pointer-events-none min-w-56 rounded-full w-fit block mx-auto px-3 py-2 cursor-pointer shadow-md transition-all duration-500 ease-in-out text-white overflow-hidden`}
                        >

                            {/* span thath represents ::before pseudo-class */}
                            <span
                                ref={progressBarRef}
                                style={{
                                    width: `${savingPurchase.progress}%`, transition: "width 0.5s ease-in-out"
                                }}
                                className={`absolute top-0 left-0 h-full bg-secondary-blue z-0 transition-all`}
                            ></span>

                            <div className='relative z-[1] flex gap-2 items-center justify-center font-medium'>
                                {savingPurchase.status === "idle" && (
                                    <>
                                        <ShoppingBagIcon className="svg-shadow" size={20} />
                                        <span className="text-shadow-base">Finalizar Compra</span>
                                    </>
                                )}
                                {savingPurchase.status === "saving" && (
                                    <>
                                        <ShoppingBagIcon className="svg-shadow" size={20} />
                                        <span className="text-shadow-base">Salvando sua compra...</span>
                                    </>
                                )}
                                {savingPurchase.status === "success" && (
                                    <>
                                        <Check className="svg-shadow w-5 h-5 text-snow" size={20} />
                                        <span className="text-shadow-base">Compra Salva!</span>
                                    </>
                                )}
                                {savingPurchase.status === "error" && (
                                    <>
                                        <X className="w-5 h-5 text-snow" size={20} />
                                        <span className="text-shadow-base">Erro</span>
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

                const ordenedProducts = products?.sort((a, b) => a.name.localeCompare(b.name)) || []

                return (
                    <Fade key={category.name} damping={2} cascade triggerOnce>
                        <CategoryWrapper
                            // key={category.name}
                            activeCondition={false}
                        >
                            {(handleClick, open) => {
                                return (
                                    <div
                                        className="w-full rounded shadow"
                                    >
                                        <div
                                            style={{
                                                background: category.color,
                                            }}
                                            className="relative z-[2] flex px-3 py-2 items-center rounded justify-between text-secondary-dark">
                                            <div className='relative flex items-center gap-3'>
                                                <div
                                                    style={{
                                                        background: category.color,
                                                    }}
                                                    className='absolute -top-3.5 -left-6 w-[56px] h-[56px] rounded-full flex items-center justify-center'
                                                >
                                                    <category.icon />
                                                </div>

                                                <span className="text-lg pl-12">{category.name}</span>

                                                {ordenedProducts.length > 0 && (
                                                    <span className='italic'>({ordenedProducts.length} produto(s))</span>
                                                )}
                                            </div>
                                            <ChevronDown
                                                size={20}
                                                onClick={handleClick}
                                                className={`${open ? 'rotate-180' : 'rotate-0'} transition-transform duration-200 cursor-pointer`} />
                                        </div>

                                        {loadingProducts ? (
                                            <div className="flex flex-col gap-2 ml-2 mt-2 p-1">
                                                <Skeleton className="w-36 h-4" />
                                                <Skeleton className="w-80 h-4" />
                                            </div>
                                        ) : (
                                            <>
                                                <div
                                                    className={`${open ? 'max-h-[10000px]' : 'max-h-0'} bg-secondary-dark grid overflow-hidden transition-all duration-500`}
                                                >
                                                    {ordenedProducts.length > 0 ? (
                                                        <React.Fragment>
                                                            {ordenedProducts.map((item) => (
                                                                <div
                                                                    key={item.name}
                                                                    className="flex flex-col gap-4 rounded"
                                                                >
                                                                    <div
                                                                        className={`relative rounded pl-3 py-3 flex flex-col gap-2 text-paragraphdark ${item.checked
                                                                            && "font-semibold bg-snow/5"
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <label
                                                                                htmlFor={item.name}
                                                                                className="flex-1 flex items-center gap-2"
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.checked}
                                                                                    id={item.name}
                                                                                    onClick={() => handleItemCheckbox(item)}
                                                                                    className="w-4 h-4 accent-primary-blue border-2 border-paragraph rounded"
                                                                                />
                                                                                <span
                                                                                    title={item.name}
                                                                                    className="max-w-60 text-ellipsis overflow-hidden whitespace-nowrap">{item.name}</span>
                                                                            </label>
                                                                            <div className="relative mr-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer">
                                                                                <EllipsisVertical
                                                                                    size={16}
                                                                                    onClick={() => setOptionMenu(item.id)}
                                                                                />
                                                                                {optionMenu === item.id && (
                                                                                    <>
                                                                                        <div
                                                                                            ref={dropDownRef}
                                                                                            className={`${optionMenu === item.id
                                                                                                ? "animate-in fade-in-0 zoom-in-85"
                                                                                                : "animate-out fade-out-0 zoom-out-85"
                                                                                                } absolute z-40 py-1 right-7 -top-2 rounded shadow border border-paragraphdark/30 bg-secondary-dark text-linkdark text-sm grid gap-1`}
                                                                                        >
                                                                                            <span
                                                                                                className="px-3"
                                                                                                onClick={() => {
                                                                                                    setOptionMenu(null);
                                                                                                    setModal({
                                                                                                        state: "OPEN",
                                                                                                        type: "EDIT_PRODUCT",
                                                                                                    });
                                                                                                    setItem(item);
                                                                                                }}
                                                                                            >
                                                                                                Editar
                                                                                            </span>
                                                                                            <hr className='border-paragraphdark/30' />
                                                                                            <span
                                                                                                className="px-3"
                                                                                                onClick={() => {
                                                                                                    setOptionMenu(null);
                                                                                                    setModal({
                                                                                                        state: "OPEN",
                                                                                                        type: "DELETE_PRODUCT",
                                                                                                    });
                                                                                                    setItem(item)
                                                                                                }}
                                                                                            >
                                                                                                Excluir
                                                                                            </span>
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-4">
                                                                            <span>qntd: {item.quantity}</span>
                                                                            <span>
                                                                                valor: R${" "}
                                                                                {item.value.replace(".", ",") || "0,00"}
                                                                            </span>
                                                                            <span>
                                                                                total: R${" "}
                                                                                {formatNumber(item.value, item.quantity)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </React.Fragment>
                                                    ) : (
                                                        <p className="text-paragraphdark text-center mt-2">
                                                            Sem itens
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )
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
    )
}

export default ShoppingList;
