import { getCurrentRangeEndDate, getCurrentRangeStartDate } from "@/functions/donutFilterDates";

describe("Tests for donutChart filters functions", () => {
    it("should return the correct current range start date", () => {
        const startDate = getCurrentRangeStartDate("day", 1, 2026);
        const dateString = startDate.toISOString();
        expect(dateString).toEqual("2026-02-07T03:00:00.000Z");
    })

    it("should return the correct current range end date", () => {
        const endDate = getCurrentRangeEndDate("day", 1, 2026);
        const dateString = endDate.toISOString();
        expect(dateString).toEqual("2026-02-07T23:59:59.999Z");
    })
})