export default function formatNumber(value: string, quantity: number): string {
    if (value === '') return '0,00';
    return (parseFloat(value.replace(',', '.')) * quantity).toFixed(2).replace('.', ',')
}