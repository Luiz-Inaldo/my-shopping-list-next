
/**
 * Retorna o total da porcentagem de uma categoria específica da compra
 * 
 * @param {any} array - Array com os itens da compra
 * @param {string} category - Categoria específica
 * @returns {string | undefined} - O valor em string da porcentagem ou indefinido se o array for null
 */
export const calculatePercentage = (array: any, category: string): string | undefined => {
    if (!Array.isArray(array)) return;
    const totalItemsLength = array.length;
    const totalCategoryLength = array.filter(
        (item: any) => item.category.toLowerCase() === category.toLocaleLowerCase()
    ).length;
    const totalPercentage = (totalCategoryLength / totalItemsLength) * 100;
    return `${totalPercentage.toFixed(2)}%`

};