import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";


export async function getPurchaseList(userId: string) {
  const q = query(collection(db, "purchases"), where("user_id", "==", userId));

  const result = await getDocs(q);
  const purchaseData = result.docs.map((doc) => {
    return {
        id: doc.id,
        ...doc.data()
    }
  });
  console.log(purchaseData)
//   console.log(result.forEach((doc) => console.log(doc.data())))

  return {
    data: purchaseData
  };
};
