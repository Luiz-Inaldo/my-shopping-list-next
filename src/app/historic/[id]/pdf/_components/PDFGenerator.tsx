"use client";
import { Button } from "@/components/ui/button";
import { useShoplistContext } from "@/context/ShoplistContext";
import { formatCurrency } from "@/functions/formatCurrency"
import { formatDate } from "@/functions/formatDate";
import { APP_ROUTES } from "@/routes/app-routes";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export function HistoricListPDF() {

    const { productsList, loadingProductsList } = useShoplistContext();

    const PDFRef = useRef<HTMLDivElement>(null);

    const products = productsList?.purchase_items || []
    const totalAmount = productsList?.total_price || 0
    const today = new Date().toISOString();

    // Agrupar produtos por categoria e calcular totais
    const categoryTotals = products.reduce(
        (acc, product) => {
            const total = Number(product.value) * Number(product.quantity)
            if (!acc[product.category]) {
                acc[product.category] = 0
            }
            acc[product.category] += total
            return acc
        },
        {} as Record<string, number>,
    )

    // Ordenar categorias por valor (maior para menor)
    const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)

    // Quebra de página simples: se houver mais de 20 itens, força quebra antes das categorias
    const hasManyItems = products.length > 20

    const formattedTitle = (title: string) => {
        return title.replace(/ /g, '_').toLowerCase()
    }

    const handlePrintPDF = useReactToPrint({
        contentRef: PDFRef,
        documentTitle: `${formattedTitle(productsList?.title as string)}.pdf`,
        pageStyle: `
          @media print {
            @page {
              size: A4;
              margin: 20mm 15mm;
              padding: 0;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.4;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .page-break {
              page-break-before: always;
            }
            
            .avoid-break {
              page-break-inside: avoid;
            }
            
            .print-container {
              padding: 20px;
              background: white;
            }
            
            /* Melhorar quebra de páginas para tabelas */
            table, thead, tbody, tr {
              page-break-inside: avoid;
            }
            
            /* Garantir que cabeçalhos não fiquem sozinhos */
            h1, h2, h3 {
              page-break-after: avoid;
            }
            
            /* Espaçamento entre seções */
            .section-break {
              margin-bottom: 30px;
            }
          }
        `
    });

    if (loadingProductsList || !productsList) {
        return <div className="flex flex-col items-center justify-center h-screen gap-4">
            <Loader2 className="size-16 animate-spin text-default-green" />
            <p className="text-paragraph font-medium">Gerando PDF...</p>
        </div>
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-white p-3 bg-default-green">
                <h1>{`${formattedTitle(productsList?.title as string)}.pdf`}</h1>
                <div className="flex items-center gap-2">
                    <Link href={APP_ROUTES.private.historic.details.name(productsList?.id as string)}>
                        <Button size='icon' className="text-sm bg-transparent hover:bg-transparent">
                            <ArrowLeft className="size-6" />
                        </Button>
                    </Link>
                    <Button size='icon' onClick={handlePrintPDF} className="text-sm bg-transparent hover:bg-transparent">
                        <Save className="size-6" />
                    </Button>
                </div>
            </div>
            <div ref={PDFRef} className="print-container bg-white p-4 mx-4 mb-4">
                {/* Cabeçalho */}
                <div className="avoid-break mb-12 border-b-2 border-[#dadada] pb-4">
                    <img
                        src="/images/test-logo-2.svg"
                        alt="Logo"
                        width={159}
                        height={50}
                        style={{ display: 'block' }}
                    />
                    <div className="mt-6 flex items-end justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-wider text-gray-500">Lista de Compras</p>
                            <h2 className="mt-1 text-xl font-medium uppercase text-[#212529]">{productsList?.title}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm uppercase tracking-wider text-gray-500">Data</p>
                            <p className="mt-1 text-lg text-[#212529]">
                                {formatDate(productsList?.end_date)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de Produtos */}
                <div className="section-break mb-8">
                    <h3 className="uppercase font-semibold tracking-wider text-text-[#212529] mb-4 pb-1">Produtos</h3>
                    <div className="space-y-3">
                        {/* Cabeçalho da tabela */}
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[#dadada] pb-3 text-sm font-medium uppercase tracking-wider text-text-[#212529]">
                            <div>Item</div>
                            <div className="text-center">Qtd</div>
                            <div className="text-center">Un</div>
                            <div className="text-right">Preço Unit.</div>
                            <div className="text-right">Subtotal</div>
                        </div>

                        {/* Linhas de produtos */}
                        {products.map((product, index) => (
                            <div
                                key={product.id || `product-${index}`}
                                className={`avoid-break grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[#dadada] py-3 text-base text-gray-600 ${hasManyItems && index === 15 ? 'page-break' : ''
                                    }`}
                            >
                                <div className="flex flex-col">
                                    <span>{product.name}</span>
                                </div>
                                <div className="text-center">{product.quantity}</div>
                                <div className="text-center">{product.unit_type}</div>
                                <div className="text-right">
                                    {formatCurrency(Number(product.value))}
                                </div>
                                <div className="text-right font-bold">
                                    {formatCurrency(Number(product.value) * Number(product.quantity))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Geral */}
                    <div className="mt-8 flex justify-end">
                        <div className="w-80">
                            <div className="flex items-center justify-between text-[#212529]">
                                <span className="text-xl font-semibold uppercase tracking-wide">Total</span>
                                <span className="text-2xl font-bold">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gastos por Categoria */}
                <div className={`${hasManyItems ? 'page-break' : ''} mt-8 border-t-2 border-[#dadada] pt-8`}>
                    <h3 className="mb-6 font-semibold uppercase tracking-wider text-text-[#212529]">
                        Gastos por Categoria
                    </h3>
                    <div className="space-y-5">
                        {sortedCategories.map(([category, total]) => {
                            const percentage = (total / totalAmount) * 100
                            return (
                                <div key={category} className="flex items-baseline justify-between">
                                    <span className="font-medium text-gray-700">{category}</span>
                                    <div className="space-x-2">
                                        <span className="font-semibold text-lg text-gray-600">
                                            {formatCurrency(total)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Rodapé */}
                <div className="mt-8 border-t border-[#dadada] pt-6 text-center">
                    <p className="text-sm text-gray-500">Documento gerado em {formatDate(today)}</p>
                </div>
            </div>
        </div>
    )
}
