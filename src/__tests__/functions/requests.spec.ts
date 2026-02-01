/**
 * @jest-environment node
 */
import { tryCatchRequest } from "@/functions/requests";

describe("tryCatchRequest", () => {
    jest.setTimeout(15000); // Increase timeout for 1s delay tests

    it("should return [true, null] on success after 1 second", async () => {
        const mockFn = jest.fn().mockResolvedValue("success");

        const result = await tryCatchRequest(mockFn);

        expect(result).toEqual([true, null]);
        expect(mockFn).toHaveBeenCalled();
    });

    it("should return [null, null] on failure after 1 second", async () => {
        const mockFn = jest.fn().mockRejectedValue(new Error("failure"));

        const result = await tryCatchRequest(mockFn);

        expect(result).toEqual([null, null]);
        expect(mockFn).toHaveBeenCalled();
    });
});
