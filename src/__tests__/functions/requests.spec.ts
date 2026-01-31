/**
 * @jest-environment node
 */
import { tryCatchRequest } from "@/functions/requests";

describe("tryCatchRequest", () => {
    jest.setTimeout(15000); // Increase timeout for 1s delay tests

    it("should return [true, null] on success after 1 second", async () => {
        const startTime = Date.now();
        const mockFn = jest.fn().mockResolvedValue("success");

        const result = await tryCatchRequest(mockFn);
        const endTime = Date.now();

        expect(result).toEqual([true, null]);
        expect(mockFn).toHaveBeenCalled();
        expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
    });

    it("should return [null, true] on failure after 1 second", async () => {
        const startTime = Date.now();
        const mockFn = jest.fn().mockRejectedValue(new Error("failure"));

        const result = await tryCatchRequest(mockFn);
        const endTime = Date.now();

        expect(result).toEqual([null, true]);
        expect(mockFn).toHaveBeenCalled();
        expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
    });
});
