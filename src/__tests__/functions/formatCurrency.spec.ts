import { formatCurrency } from "@/functions/formatCurrency";

describe('formatCurrency Utility Function', () => {

    it('should return the correct formatted currency', () => {
        const result = formatCurrency(1000);
        expect(result.replace(/\s/g, ' ')).toBe('R$ 1.000,00');
    });

    it('should return the correct formatted currency with decimal places', () => {
        const result = formatCurrency(1000.50);
        expect(result.replace(/\s/g, ' ')).toBe('R$ 1.000,50');
    });

    it('should return R$ 0,00 if the value is not a number', () => {
        const result = formatCurrency('test' as any);
        expect(result.replace(/\s/g, ' ')).toBe('R$ 0,00');
    });

})