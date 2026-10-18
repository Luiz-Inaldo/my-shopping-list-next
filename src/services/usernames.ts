import { db } from "@/lib/firebase";
import { SelectedShareUser } from "@/types/share";
import { collection, getDocs, query, where } from "firebase/firestore";

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

export async function searchUsernamesByPrefix(
  prefix: string
): Promise<SelectedShareUser[]> {
  const q = query(
    collection(db, "users"),
    where("name", ">=", prefix),
    where("name", "<", prefix + "")
  );

  const snap = await getDocs(q);
  if (snap.empty) return [];

  return snap.docs.map((userDoc) => {
    const data = userDoc.data();
    return {
      id: userDoc.id,
      username: data.name as string,
      profile_img: (data.profile_img as string) ?? "",
    };
  });
}
