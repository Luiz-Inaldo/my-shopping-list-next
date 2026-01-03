import { FirebaseError } from "firebase/app";

export async function tryCatchRequest(fn: () => Promise<any>): Promise<[ boolean | null, FirebaseError | null ]> {

    try {
        await fn();
        return [ true, null ];
    } catch (error) {
        if (error instanceof FirebaseError) {
            return [ null, error ];
        }
        return [ null, null ];
    }
}