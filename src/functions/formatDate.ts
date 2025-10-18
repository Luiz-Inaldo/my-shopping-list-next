export function formatDate(date: any): string {

    if (typeof date === 'string') {
        return date.split("T")[0].split("-").reverse().join("/");
    };

    if (typeof date === 'object') {
        return date?.toDate().toLocaleDateString()
    };

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}