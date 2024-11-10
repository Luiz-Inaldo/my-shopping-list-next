"use client";
import formatNumber from '@/functions/formatNumber';
import { supabase } from '@/lib/api';
import { IProductProps, IPurchaseProps } from '@/types';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ChevronRight, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

export default function HistoricPage() {
    const params = useParams();
    const { title } = params;
    const decodedTitle = decodeURIComponent(title as string);
    const slipRef = useRef<HTMLDivElement | null>(null);

    const [purchase, setPurchase] = useState<IPurchaseProps>({
        id: "",
        title: "",
        purchase_date: "",
        purchase_items: "",
        total_price: "",
        user_id: "",
    })

    // função de baixar o pdf do cupom
    const generatePDF = () => {
        const slip = slipRef.current && slipRef.current;

        if (slip) {
            html2canvas(slip).then((canvas) => {
                const imgData = canvas.toDataURL("image/png", 0.1);
                const pdf = new jsPDF();
                const pageHeight = 287 // altura da página do PDF em mm
                const imgHeight = (canvas.height * 104) / canvas.width;
                let heightLeft = imgHeight;
                let position = 10;
                
                pdf.addImage(imgData, 'PNG', 10, 7, 104, imgHeight);
                heightLeft -= pageHeight;
                
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, 104, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save(`${decodedTitle}.pdf`);
            });
        };

    }

    //chamada para a api do supabase
    useEffect(() => {
        const fetchPurchase = async () => {
            const { data, error } = await supabase.from("purchases").select("*").eq("title", decodedTitle).single();
            if (error) {
                console.error(error);
            } else {
                setPurchase(data);
            }
        }
        fetchPurchase();
    }, []);

    useEffect(() => {
        if (purchase.purchase_items.length > 0) {
            setPurchase(old => {
                return {
                    ...old,
                    purchase_items: typeof old.purchase_items === 'string' ? JSON.parse(old.purchase_items) : old.purchase_items
                }
            })
        }
    }, [purchase.purchase_items])

    return (
        <>
            <div className='p-5 grid 2xsm:grid-cols-1 gap-10'>

                {/* breadcrumb */}
                <div className='flex items-center gap-2 text-sm text-subtitle'>
                    {/* <ArrowLeft size={20} /> */}
                    <Link
                        href="/historic"
                        className='text-blue-700'
                    >
                        Histórico
                    </Link>
                    <ChevronRight size={20} />
                    <p>{decodedTitle}</p>
                </div>
                {/* end breadcrumb */}

                {purchase.purchase_items.length > 0 ? (
                    <React.Fragment>
                        <div
                            ref={slipRef}
                            className='flex flex-col p-5 gap-4 border border-gray-400 rounded-md bg-yellow-50 shadow'>
                            {/* slip header */}
                            <div className='text-center'>
                                <h1 className='text-subtitle font-semibold pb-1 mb-2 border-b border-dashed border-gray-400'>
                                    {decodedTitle}
                                </h1>
                                <p className='text-sm'>
                                    {`ID: ${purchase.id}`}
                                </p>
                                <p className='text-sm font-medium'>
                                    {`Data: ${purchase.purchase_date.split("T")[0].split("-").reverse().join("/")} ${purchase.purchase_date.split("T")[1].split(".")[0]}`}
                                </p>
                            </div>
                            {/* end slip header */}

                            {/* slip content */}
                            <div className='flex flex-col gap-1 border-t border-b border-dashed border-gray-400'>

                                {/* content header */}
                                <div className='flex uppercase text-[10px] border-b border-dashed border-gray-400'>
                                    <div className='flex-1 flex items-center p-[2px]'>
                                        # descrição
                                    </div>
                                    <div className='flex items-center p-[2px] basis-9'>
                                        qntd
                                    </div>
                                    <div className='flex items-center p-[2px] basis-11'>
                                        vl unit
                                    </div>
                                    <div className='flex items-center p-[2px] basis-[50px]'>
                                        vl total
                                    </div>
                                </div>
                                {/* end content header */}

                                {/* content items */}
                                {
                                    Array.isArray(purchase.purchase_items) && (
                                        purchase.purchase_items.sort((a, b) => a.name.localeCompare(b.name)).map((item: IProductProps, index: number) => (
                                            <div key={item.id} className='flex uppercase text-[10px] text-subtitle'>
                                                <div className='flex-1 flex items-center p-[2px] max-w-[215px] text-ellipsis overflow-hidden whitespace-nowrap'>
                                                    {`${index + 1} - ${item.name}`}
                                                </div>
                                                <div className='flex items-center p-[2px] basis-9 justify-end'>
                                                    {item.quantity}
                                                </div>
                                                <div className='flex items-center p-[2px] basis-11 justify-end'>
                                                    {item.value.replace(".", ",") || "0,00"}
                                                </div>
                                                <div className='flex items-center p-[2px] basis-[50px] justify-end'>
                                                    {formatNumber(item.value, item.quantity)}
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                                {/* end content items */}

                                <div className='flex items-center justify-between uppercase text-md font-medium mb-5 mt-2 text-subtitle'>
                                    <span>total R$</span>
                                    <span>{purchase.total_price}</span>
                                </div>

                            </div>
                            {/* end slip content */}

                            <p className='text-xs text-paragraph text-center'>
                                Esse slip não tem valor fiscal
                            </p>
                        </div>

                        <button
                            onClick={generatePDF}
                            className='mb-2 bg-secondary-blue rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out text-snow'>
                            <FileCheck size={20} />
                            salvar como PDF
                        </button>

                    </React.Fragment>
                ) : (
                    <p className='text-center text-paragraph text-xs'>carregando cupom...</p>
                )}
            </div>
        </>
    );
};