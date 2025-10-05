import { db } from "@/lib/firebase";
import { IPurchaseProps } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";


// ===============================
// # Services relacionados ao histórico
// ===============================

export async function fetchHistoricData(userId: string): Promise<IPurchaseProps[]> {
    const searchParams = query(
    collection(db, "purchases"),
    where("user_id", "==", userId),
    where("is_active", "==", false)
  );

  const result = await getDocs(searchParams);
  const purchaseData = result.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  return purchaseData as IPurchaseProps[];
}
