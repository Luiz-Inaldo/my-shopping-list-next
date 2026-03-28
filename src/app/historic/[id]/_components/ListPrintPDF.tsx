import { IPurchaseProps } from "@/types"
import { formatCurrency } from "@/functions/formatCurrency"

interface PrintPDFProps {
    list: IPurchaseProps
}

export function PrintPDF({ list }: PrintPDFProps) {

    const products = list.purchase_items || []
    const totalAmount = list.total_price || 0
    const endDate = list.end_date ? list.end_date.toDate() : new Date();

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

    return (
        <div className="print-container bg-white">
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
                        <h2 className="mt-1 text-xl font-medium uppercase text-[#212529]">{list.title}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-sm uppercase tracking-wider text-gray-500">Data</p>
                        <p className="mt-1 text-lg text-[#212529]">
                            {endDate.toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
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
                            className={`avoid-break grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[#dadada] py-3 text-base text-gray-600 ${
                                hasManyItems && index === 15 ? 'page-break' : ''
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
                <p className="text-sm text-gray-500">Documento gerado em {new Date().toLocaleString("pt-BR")}</p>
            </div>
        </div>
    )
}
