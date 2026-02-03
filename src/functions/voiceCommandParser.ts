import { PRODUCT_CATEGORIES_MAP } from "@/constants/categories";
import { UNIT_MAP } from "@/constants/unitTypes";

export function parseCommand(input: string) {
    const text = input.toLowerCase();

    // regex
    const priceRegex = /(?:r\$|valor|por)\s*(\d+(?:[\.,]\d+)?)|(\d+[\.,]\d+)/i;
    const unitTypeRegex = /\b(unidade|unidades|caixa|caixas|pacote|pacotes|caixote|caixotes|fardo|fardos|quilo|quilos|kilo|kilos|litro|litros|l|und|cx|pct|kg|lt)s?\b/i;
    const qtyRegex = /^(?:adicione\s+)?(\d+|um|uma|dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez)\s*(unidade|unidades|caixa|caixas|pacote|pacotes|caixote|caixotes|fardo|fardos|quilo|quilos|kilo|kilos|litro|litros|und|cx|pct|kg|lt)?/i;
    const nameRegex = /de\s+(.*?)(?=\s+por|$)/i;

    // 1. Extrair Preço
    const priceMatch = text.match(priceRegex);
    const price = priceMatch ? priceMatch[1] || priceMatch[2] : "0";

    // 2. Extrair Tipo de Unidade
    const unitMatch = text.match(unitTypeRegex);
    const rawUnit = unitMatch ? unitMatch[1] : "und";

    // 3. Extrair Quantidade (Texto antes da unidade)
    const qtyMatch = text.match(qtyRegex);
    let quantityText = qtyMatch ? qtyMatch[1].replace(/adicione\s+/i, '').trim() : "1";

    // Opcional: Converter "duas" ou "dois" para 2
    const quantity = parseNumbers(quantityText);

    // 4. Extrair Nome (Entre 'de' e 'por')
    const nameMatch = text.match(nameRegex);
    const name = nameMatch ? nameMatch[1] : "Item desconhecido";

    return {
        name,
        quantity,
        unit_type: UNIT_MAP[rawUnit as keyof typeof UNIT_MAP] || 'und',
        category: getProductCategory(name),
        checked: false,
        value: parseFloat(price.replace(',', '.'))
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
