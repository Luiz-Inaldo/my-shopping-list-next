export async function tryCatchRequest<R, E>(fn: () => Promise<R>): Promise<[R | null, E | null]> {

    try {
        const result = await fn();
        if (result === undefined) {
            return [true as R, null];
        }
        return [result as R, null];
    } catch (error) {
        return [null, error as E];
    }
}