import { UnitTypes } from "@/enums/unitTypes";

export const UNIT_MAP = {
    unidade: 'und', und: 'und', un: 'und',
    caixa: 'cx', cx: 'cx',
    pacote: 'pct', pct: 'pct',
    litro: 'lt', lt: 'lt', l: 'lt',
    grama: 'g', g: 'g',
    quilo: 'kg', kg: 'kg'
};

export const UNIT_TYPES = [
    {
        label: "Unidade",
        value: UnitTypes.UND
    },
    {
        label: "Quilo",
        value: UnitTypes.KG
    },
    {
        label: "Litro",
        value: UnitTypes.LT
    },
    {
        label: "Caixa",
        value: UnitTypes.CX
    },
    {
        label: "Fardo",
        value: UnitTypes.FD
    },
    {
        label: "Pacote",
        value: UnitTypes.PCT
    }
];