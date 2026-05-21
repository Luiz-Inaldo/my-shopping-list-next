import { db } from "@/lib/firebase";
import { SelectedShareUser } from "@/types/share";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

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

export async function lookupUsername(
  username: string
): Promise<SelectedShareUser | null> {

  const snap = await getDoc(doc(db, "usernames", username));
  if (!snap.exists() || snap.id !== username) return null;

  const data = snap.data();
  if (!data?.uuid) return null;

  return { id: data.uuid, username: snap.id };
}
