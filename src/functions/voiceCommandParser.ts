import { PRODUCT_CATEGORIES_MAP } from "@/constants/categories";
import { UNIT_MAP } from "@/constants/unitTypes";

// export function parseCommand(input: string) {
//     const text = input.toLowerCase();

//     // regex
//     const priceRegex = /(?:r\$|valor|por)\s*(\d+(?:[\.,]\d+)?)|(\d+[\.,]\d+)/i;
//     const unitTypeRegex = /\b(unidade|unidades|caixa|caixas|pacote|pacotes|caixote|caixotes|fardo|fardos|quilo|quilos|kilo|kilos|litro|litros|l|und|cx|pct|kg|lt)s?\b/i;
//     const qtyRegex = /^(?:adicione\s+)?(\d+|um|uma|dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez)\s*(unidade|unidades|caixa|caixas|pacote|pacotes|caixote|caixotes|fardo|fardos|quilo|quilos|kilo|kilos|litro|litros|und|cx|pct|kg|lt)?/i;
//     const nameRegex = /de\s+(.*?)(?=\s+por|$)/i;

//     // 1. Extrair Preço
//     const priceMatch = text.match(priceRegex);
//     const price = priceMatch ? priceMatch[1] || priceMatch[2] : "0";

//     // 2. Extrair Tipo de Unidade
//     const unitMatch = text.match(unitTypeRegex);
//     const rawUnit = unitMatch ? unitMatch[1] : "und";

//     // 3. Extrair Quantidade (Texto antes da unidade)
//     const qtyMatch = text.match(qtyRegex);
//     let quantityText = qtyMatch ? qtyMatch[1].replace(/adicione\s+/i, '').trim() : "1";

//     // Opcional: Converter "duas" ou "dois" para 2
//     const quantity = parseNumbers(quantityText);

//     // 4. Extrair Nome (Entre 'de' e 'por')
//     const nameMatch = text.match(nameRegex);
//     const name = nameMatch ? nameMatch[1] : "Item desconhecido";

//     return {
//         name,
//         quantity,
//         unit_type: UNIT_MAP[rawUnit as keyof typeof UNIT_MAP] || 'und',
//         category: getProductCategory(name),
//         checked: false,
//         value: parseFloat(price.replace(',', '.'))
//     };
// };

const numberMap = {
    "um": 1,
    "uma": 1,
    "dois": 2,
    "duas": 2,
    "três": 3,
    "quatro": 4,
    "cinco": 5,
    "seis": 6,
    "sete": 7,
    "oito": 8,
    "nove": 9,
    "dez": 10
}

export function parseCommand(input: string) {
    const textSplitted = input.toLowerCase().split(' ');

    /**
     * O algorítimo a seguir vai pressupor que a frase sempre terá a seguinte estrutura:
     * "<quantidade> <tipo> de <nome> [por] <preço>" ou
     * "<quantidade> <tipo> de <nome>"
     * 
     * Exemplo: "2kg de arroz por 10,00" ou "2kg de arroz"
     * 
     * Onde:
     * - <quantidade> é um número ou uma palavra que representa um número
     * - <tipo> é uma unidade de medida
     * - <nome> é o nome do produto
     * - <preço> é o preço do produto
     */

    // 1ª parte da análise do texto: Encontrar em qual índice inicia e termina o nome
    // do produto

    const initIndex = textSplitted.findIndex((word) => word === 'de');
    const endIndex = textSplitted.findIndex((word) => word === 'por');
    const hasEndIndex = endIndex !== -1;

    const name = textSplitted.slice(initIndex + 1, hasEndIndex ? endIndex : textSplitted.length).join(' ');

    // 2ª parte da análise do texto: Encontrar a quantidade do produto
    const extractedQuantity = textSplitted.slice(0, 1).join('');
    const quantity = numberMap[extractedQuantity as keyof typeof numberMap] || parseInt(extractedQuantity);

    // 3ª parte da análise do texto: Encontrar o tipo de unidade
    const extractedUnit = textSplitted.slice(1, 2).join('');
    const unitType = UNIT_MAP[extractedUnit as keyof typeof UNIT_MAP] || 'und';

    // 4ª parte da análise do texto: Encontrar o preço do produto
    const priceRange = textSplitted.slice(endIndex + 1);
    let price = 0;
    if (priceRange.includes("r$") || priceRange.includes("R$")) {
        price = parseFloat(priceRange[1].replace(',', '.'))
    } else if (priceRange.length === 1) {
        price = parseFloat(priceRange[0].replace(',', '.'))
    }

    return {
        name,
        quantity,
        unit_type: unitType,
        category: getProductCategory(name),
        checked: false,
        value: price
    };
};

// Função auxiliar para converter texto em número básico
const parseNumbers = (text: string) => {
    const nums = { "um": 1, "uma": 1, "dois": 2, "duas": 2, "três": 3, "quatro": 4, "cinco": 5 };
    return nums[text as keyof typeof nums] || (parseInt(text) || 1);
};

function getProductCategory(text: string) {
    const splittedName = text.split(' ');
    const firstWord = splittedName[0];

    return PRODUCT_CATEGORIES_MAP[firstWord as keyof typeof PRODUCT_CATEGORIES_MAP] || 'Outros';

}
