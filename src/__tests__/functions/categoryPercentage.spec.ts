import { calculatePercentage } from "@/functions/categoryPercentage";
import { IProductProps } from "@/types";

const mockProducts: IProductProps[] = [
    {
        id: '1',
        name: 'Test',
        category: 'Mercearia',
        checked: true,
        unit_type: 'und',
        quantity: 1,
        value: 1,
    },
    {
        id: '2',
        name: 'Test 2',
        category: 'Limpeza',
        checked: true,
        unit_type: 'und',
        quantity: 1,
        value: 1,
    },
    {
        id: '3',
        name: 'Test 3',
        category: 'Frios e Laticínios',
        checked: true,
        unit_type: 'und',
        quantity: 1,
        value: 1,
    },
];

describe('calculatePercentage Utility Function', () => {

    it('should return 0.00 if the array is null', () => {
        const array = null;
        const result = calculatePercentage(array, 'Mercearia');
        expect(result).toBe('0.00');
    });

    it('should return a value if the array is not null', () => {
        const result = calculatePercentage(mockProducts, 'Mercearia');
        expect(result).toBe('33.33');
    });

    it('should return 0.00 if the array is empty', () => {
        const array: IProductProps[] = [];
        const result = calculatePercentage(array, 'Mercearia');
        expect(result).toBe('0.00');
    });

    it('should return 0.00 if the category is not found', () => {
        const array = mockProducts;
        const result = calculatePercentage(array, 'test');
        expect(result).toBe('0.00');
    });

});