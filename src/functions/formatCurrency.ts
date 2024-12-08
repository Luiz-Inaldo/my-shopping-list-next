export function formatCurrency(value: string): string {

    let newNumber = value.replace(".", "").replace(",", ".");
    const parsedNumber = parseFloat(newNumber);

    return new Intl.NumberFormat("pt-BR", {
        style: 'currency',
        currency: 'BRL'
    }).format(parsedNumber);
}