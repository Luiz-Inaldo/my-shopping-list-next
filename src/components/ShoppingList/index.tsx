import React, { Suspense, useContext, useEffect, useRef, useState } from 'react'
import { Skeleton } from '../ui/skeleton';
import { CATEGORIES } from '@/constants/constants';
import { ProductsContext } from '@/context/ProductsContext';
import { IProductProps } from '@/types';
import { Modal } from '../Modal';
import { ChevronDown, EllipsisVertical } from 'lucide-react';
import formatNumber from '@/functions/formatNumber';
import CategoryWrapper from '../Category';

const ShoppingList = () => {

    const { data, loading, setModal, handleCheckItem, handleDismarkItem,
        optionMenu, setOptionMenu
    } = useContext(ProductsContext);
    const [item, setItem] = useState<IProductProps>({
        id: '',
        name: "",
        category: "",
        quantity: 0,
        value: "",
        checked: false,
    });
    const [listName, setListName] = useState<string>('');

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

    /* ----> refs <----- */
    const dropDownRef = useRef<any>(null);

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

    useEffect(() => {
        const listNameFromLocal = JSON.parse(localStorage.getItem('purchase') || '');
        if (listNameFromLocal !== '') {
            setListName(listNameFromLocal)
        }
    }, [])

    return (
        <>
            <h2 className='text-2xl mb-10 font-bold px-4 pb-1 border-b border-[#999] w-fit mx-auto'>
                {listName}
            </h2>

            {/* <p className="text-xl ml-3 text-subtitle mb-5">Categorias</p> */}

            {/* caregory list */}
            {CATEGORIES.map((category) => {
                const products = data.filter(
                    (product) => product.category === category.name
                );

                const ordenedProducts = products.sort((a, b) => a.name.localeCompare(b.name))

                return (
                    <CategoryWrapper
                        key={category.name}
                        activeCondition={ordenedProducts.length > 0}
                    >
                        {(handleClick, open) => {
                            return (
                                <div
                                    className="w-full pb-3 rounded bg-snow"
                                >
                                    <div
                                        style={{
                                            background: category.color,

                                        }}
                                        className="sticky top-0 z-[2] flex px-3 py-2 items-center justify-between text-subtitle">
                                        <div className='flex items-center gap-3'>
                                            <category.icon />
                                            <span className="text-lg">{category.name}</span>
                                            {ordenedProducts.length > 0 && (
                                                <span className='italic'>({ordenedProducts.length} produtos)</span>
                                            )}
                                        </div>
                                        <ChevronDown
                                            size={20}
                                            onClick={handleClick}
                                            className={`${open ? 'rotate-180' : 'rotate-0'} transition-transform duration-200 cursor-pointer`} />
                                    </div>
                                    {loading ? (
                                        <div className="flex flex-col gap-2 ml-2 mt-2 p-1">
                                            <Skeleton className="w-36 h-4" />
                                            <Skeleton className="w-80 h-4" />
                                        </div>
                                    ) : (
                                        <>
                                            <div
                                                className={`${open ? 'max-h-[10000px]' : 'max-h-0'} overflow-hidden transition-all duration-500`}
                                            >
                                                {ordenedProducts.length > 0 ? (
                                                    <React.Fragment>
                                                        {ordenedProducts.map((item) => (
                                                            <div
                                                                key={item.name}
                                                                className="flex flex-col gap-4 ml-2 mt-2 p-1 rounded"
                                                            >
                                                                <div
                                                                    className={`relative flex flex-col gap-2 ${item.checked
                                                                        ? "font-bold"
                                                                        : "text-paragraph"
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
                                                                            <span className="max-w-60">{item.name}</span>
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
                                                                                            } absolute z-40 py-1 right-7 rounded shadow border border-gray-200 bg-snow grid gap-1`}
                                                                                    >
                                                                                        <span
                                                                                            className="px-3 text-paragraph"
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
                                                                                        <hr />
                                                                                        <span
                                                                                            className="px-3 text-paragraph"
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
                                                    <p className="text-paragraph text-center mt-2">
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
                );
            })}
            {/* end category list */}
            <Suspense fallback={null}>
                <Modal item={item} />
            </Suspense>
        </>
    )
}

export default ShoppingList