import { db } from "@/lib/firebase";
import { IPurchaseProps } from "@/types";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

export async function getActivePurchaseList(userId: string) {
  const searchParams = query(
    collection(db, "purchases"),
    where("user_id", "==", userId),
    where("is_active", "==", true)
  );

  const result = await getDocs(searchParams);
  const purchaseData = result.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  return {
    data: purchaseData,
  };
};

export async function addPurchaseToDb(purchase: IPurchaseProps) {
  await addDoc(collection(db, "purchases"), purchase);
}

export async function deletePurchaseFromDb(purchaseId: string) {
  await deleteDoc(doc(db, "purchases", purchaseId));
};

export async function saveCurrentPurchase(purchase: IPurchaseProps) {
  const docRef = doc(db, "purchases", purchase.id as string);
  await updateDoc(docRef, {
    is_active: false,
    end_date: purchase.end_date,
    total_price: purchase.total_price
  });
}
