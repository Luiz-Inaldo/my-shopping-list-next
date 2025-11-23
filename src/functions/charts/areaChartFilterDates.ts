export function getLastSixMonthsDate() {
    const now = new Date();
    let month = now.getMonth();
    let year = now.getFullYear();
    let numberOfMonthsBack = 6;
    const monthYearRange = []

    while (numberOfMonthsBack > 0) {
        month -= 1;
        if (month < 0) {
            month = 11;
            year -= 1;
        }
        monthYearRange.push(String(year) + "-" + String(month + 1).padStart(2, "0"))
        numberOfMonthsBack -= 1;
    }
    
    return {
        date: new Date(Date.UTC(year, month, 1, 3, 0, 0, 0)),
        range: monthYearRange.reverse()
    };
}