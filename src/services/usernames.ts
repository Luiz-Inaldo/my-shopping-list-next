import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Obtém a lista de usernames disponíveis.
 * @returns {Promise<{ list: string[] }>} - Lista de usernames disponíveis.
 */
export async function getUsernamesList(): Promise<{ list: string[] }> {
    const usernamesRef = collection(db, "usernames");
    const result = await getDocs(usernamesRef);
    const usernames = result.docs.map((doc) => doc.id);
    return {
        list: usernames
    };
}
