import { sleep } from "./sleep";

export async function tryCatchRequest(fn: () => Promise<any>): Promise<[boolean | null, boolean | null]> {

    try {
        await sleep(1);
        await fn();
        return [true, null];
    } catch {
        return [null, true];
    }
}