import { Timestamp } from "firebase/firestore";

/**
 * @description Função para formatar a data. Essa função não pode receber um objeto Date, apenas uma string ou um Timestamp, pois os dados no formato de data vindos do backend são no formato de Timestamp do Firebase.
 * @example formatDate('2021-01-01') // 01/01/2021
 * @example formatDate(Timestamp.fromDate(new Date(2021, 0, 1))) // 01/01/2021
 * @example formatDate(null) // ""
 * @example formatDate(undefined) // ""
 * @param {string | Timestamp | null | undefined} date - Data a ser formatada
 * @returns {string | undefined} Data formatada
 */
export function formatDate(date: string | Timestamp | null | undefined): string | undefined {

    if (!date) return "";

    if (typeof date === 'string') {
        return date.split("T")[0].split("-").reverse().join("/");
    };

    if (typeof date === 'object') {
        return (date as Timestamp).toDate().toLocaleDateString()
    };

    // return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}