export default function formatNumber(value: string, quantity: number): string {
    return (parseFloat(value.replace(',', '.')) * quantity).toFixed(2).replace('.', ',')
}