import { IProductProps } from "@/types";

/**
 * Retorna o total da porcentagem de uma categoria específica da compra
 * 
 * @param {IProductProps[] | null | undefined} array - Array com os itens da compra
 * @param {string} category - Categoria específica
 * @returns {string} - O valor em string da porcentagem ou '0' se o array for null
 */
export const calculatePercentage = (array: IProductProps[] | null | undefined, category: string): string => {
    if (!Array.isArray(array) || array.length === 0) return '0.00';
    const totalItemsLength = array.length;
    const totalCategoryLength = array.filter(
        (item: IProductProps) => item.category.toLowerCase() === category.toLocaleLowerCase()
    ).length;
    const totalPercentage = (totalCategoryLength / totalItemsLength) * 100;
    return `${totalPercentage.toFixed(2)}`

};