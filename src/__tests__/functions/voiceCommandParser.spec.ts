import { parseCommand } from "@/functions/voiceCommandParser";
import { ItemCategories } from "@/enums/categories";

describe("voiceCommandParser", () => {
    it("should parse a complete command with units, name and price", () => {
        const input = "2 pacotes de arroz por 15.50";
        const result = parseCommand(input);

        expect(result).toEqual({
            name: "arroz",
            quantity: 2,
            unit_type: "pct",
            category: ItemCategories.MERCEARIA,
            checked: false,
            value: 15.50
        });
    });

    it("should parse a command with number in words", () => {
        const input = "duas caixas de leite por 5,90";
        const result = parseCommand(input);

        expect(result).toEqual({
            name: "leite",
            quantity: 2,
            unit_type: "cx",
            category: ItemCategories.FRIOS_E_LATICINIOS,
            checked: false,
            value: 5.90
        });
    });

    it("should parse a command using 'r$' and comma in price", () => {
        const input = "1 quilo de paleta c/ osso por R$ 35,00";

        const result = parseCommand(input);

        expect(result).toEqual({
            name: "paleta c/ osso",
            quantity: 1,
            unit_type: "kg",
            category: ItemCategories.CARNES_E_PEIXES,
            checked: false,
            value: 35.00
        });
    });

    it("should parse a command without price", () => {
        const input = "2 unidades de bananas";
        const result = parseCommand(input);

        expect(result).toEqual({
            name: "bananas",
            quantity: 2,
            unit_type: "und",
            category: ItemCategories.HORTIFRUTI,
            checked: false,
            value: 0
        });
    });

    it("should use 'Outros' category for unknown items", () => {
        const input = "1 unidade de item-inexistente por 10";
        const result = parseCommand(input);

        expect(result.category).toBe("Outros");
    });

    it("should handle abbreviated units", () => {
        const input = "2 lt de suco por 5";
        const result = parseCommand(input);

        expect(result.unit_type).toBe("lt");
        expect(result.name).toBe("suco");
    });

    it("should handle commands starting directly with quantity", () => {
        const input = "5 pacotes de biscoito por 4.00";
        const result = parseCommand(input);

        expect(result).toEqual({
            name: "biscoito",
            quantity: 5,
            unit_type: "pct",
            category: ItemCategories.PADARIA,
            checked: false,
            value: 4.00
        });
    });
});
