import { UnitTypes } from "@/enums/unitTypes";

export const UNIT_MAP = {
    unidade: 'und', unidades: 'und', und: 'und', un: 'und',
    caixa: 'cx', caixas: 'cx', cx: 'cx',
    pacote: 'pct', pacotes: 'pct', pct: 'pct',
    litro: 'lt', litros: 'lt', lt: 'lt', l: 'lt',
    grama: 'g', gramas: 'g', g: 'g',
    quilo: 'kg', quilos: 'kg', kg: 'kg',
    fardo: 'fd', fardos: 'fd', fd: 'fd'
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