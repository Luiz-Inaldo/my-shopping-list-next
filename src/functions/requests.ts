import { FirebaseError } from "firebase/app";

export async function tryCatchRequest<T>(fn: () => Promise<T>): Promise<[ T | null, FirebaseError | null ]> {

    try {
        await fn();
        return [ true as T, null ];
    } catch (error) {
        if (error instanceof FirebaseError) {
            return [ null, error ];
        }
        return [ null, null ];
    }
}