import { formatDate } from "@/functions/formatDate";
import { Timestamp } from "firebase/firestore";

describe('formatDate Utility Function', () => {

    it('should return the correct formatted date', () => {
        const result = formatDate('2021-01-01');
        expect(result).toBe('01/01/2021');
    });

    it('should return the correct date if the value is a date object (FireBase Timestamp)', () => {
        const result = formatDate(Timestamp.fromDate(new Date(2021, 0, 1)));
        expect(result).toBe('01/01/2021');
    });


    it('should return an empty string if the value is null or undefined', () => {
        const result = formatDate(null);
        expect(result).toBe('');

        const result2 = formatDate(undefined);
        expect(result2).toBe('');
    });

})