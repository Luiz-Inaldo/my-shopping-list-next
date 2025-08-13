export function formatDate(date: Date | string): string {

    if (typeof date === 'string') {
        return date.split("T")[0].split("-").reverse().join("/");
    };

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}