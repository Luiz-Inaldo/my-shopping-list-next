/**
 * @jest-environment node
 */
import {
    calculateSpendingDifference,
    calculateTotalItemsBought,
    calculateTotalLists,
    calculateTotalSpending,
    groupPurchasesByMonth,
} from "@/functions/monthlyStatistics";
import { TMonthlyStatisticsResponse } from "@/types";

describe("Monthly Statistics Utility Functions", () => {
    const mockPurchases: TMonthlyStatisticsResponse = [
        {
            id: "1",
            title: "List 1",
            is_active: false,
            max_value: 100,
            total_price: 80,
            user_id: "user1",
            start_date: "2026-01-15T10:00:00Z",
            end_date: "2026-01-15T11:00:00Z",
            purchase_items: [
                { id: "i1", name: "Item 1", category: "Cat1", quantity: 1, value: 50, checked: true, unit_type: "UN" as any },
                { id: "i2", name: "Item 2", category: "Cat1", quantity: 1, value: 30, checked: true, unit_type: "UN" as any },
            ],
        },
        {
            id: "2",
            title: "List 2",
            is_active: false,
            max_value: 200,
            total_price: 150,
            user_id: "user1",
            start_date: "2026-01-20T10:00:00Z",
            end_date: "2026-01-20T11:00:00Z",
            purchase_items: [
                { id: "i3", name: "Item 3", category: "Cat2", quantity: 2, value: 75, checked: false, unit_type: "UN" as any },
            ],
        },
        {
            id: "3",
            title: "List 3",
            is_active: false,
            max_value: 50,
            total_price: 40,
            user_id: "user1",
            start_date: "2025-12-15T10:00:00Z",
            end_date: "2025-12-15T11:00:00Z",
            purchase_items: [],
        },
    ];

    describe("groupPurchasesByMonth", () => {
        it("should group purchases by year and month correctly", () => {
            const result = groupPurchasesByMonth(mockPurchases);
            expect(result["2026-0"]).toHaveLength(2);
            expect(result["2025-11"]).toHaveLength(1);
        });

        it("should ignore purchases without a start_date", () => {
            const incompletePurchases: TMonthlyStatisticsResponse = [
                ...mockPurchases,
                { id: "4", title: "No Date", is_active: true, max_value: 0, total_price: 0, user_id: "u1", start_date: null, end_date: null }
            ];
            const result = groupPurchasesByMonth(incompletePurchases);
            expect(Object.keys(result)).toHaveLength(2);
        });

        it("should return an empty object for empty input", () => {
            expect(groupPurchasesByMonth([])).toEqual({});
        });
    });

    describe("calculateTotalSpending", () => {
        it("should sum total_price correctly", () => {
            const result = calculateTotalSpending(mockPurchases.slice(0, 2));
            expect(result).toBe(230); // 80 + 150
        });

        it("should handle missing total_price by treating it as 0", () => {
            const purchases: TMonthlyStatisticsResponse = [
                { id: "1", title: "T1", is_active: true, max_value: 0, total_price: 0, user_id: "u1", start_date: null, end_date: null }
            ];
            // Note: total_price is 0 or missing in this mock
            delete (purchases[0] as any).total_price;
            expect(calculateTotalSpending(purchases)).toBe(0);
        });

        it("should return 0 for empty input", () => {
            expect(calculateTotalSpending([])).toBe(0);
        });
    });

    describe("calculateTotalLists", () => {
        it("should return the correct number of lists", () => {
            expect(calculateTotalLists(mockPurchases)).toBe(3);
        });

        it("should return 0 for empty input", () => {
            expect(calculateTotalLists([])).toBe(0);
        });
    });

    describe("calculateTotalItemsBought", () => {
        it("should count only checked items", () => {
            const result = calculateTotalItemsBought(mockPurchases);
            expect(result).toBe(2); // List 1 has 2 checked, List 2 has 0 checked, List 3 has 0 items
        });

        it("should return 0 if there are no items", () => {
            expect(calculateTotalItemsBought([mockPurchases[2]])).toBe(0);
        });

        it("should return 0 for empty input", () => {
            expect(calculateTotalItemsBought([])).toBe(0);
        });
    });

    describe("calculateSpendingDifference", () => {
        it("should return correct difference (Previous - Current)", () => {
            const currentMonth: TMonthlyStatisticsResponse = [mockPurchases[0]]; // 80
            const previousMonth: TMonthlyStatisticsResponse = [mockPurchases[2]]; // 40
            const result = calculateSpendingDifference(previousMonth, currentMonth);
            expect(result).toBe(-40); // 40 - 80
        });

        it("should return positive value if previous month spent more", () => {
            const currentMonth: TMonthlyStatisticsResponse = [mockPurchases[2]]; // 40
            const previousMonth: TMonthlyStatisticsResponse = [mockPurchases[0]]; // 80
            const result = calculateSpendingDifference(previousMonth, currentMonth);
            expect(result).toBe(40); // 80 - 40
        });
    });
});
