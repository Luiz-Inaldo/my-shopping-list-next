import { db } from "@/lib/firebase";
import { IPurchaseProps } from "@/types";
import { Filters } from "@/types/filters";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  QueryConstraint,
} from "firebase/firestore";

export async function getPurchasesList(userId: string, filters?: Filters[]) {
  
  const whereParams: QueryConstraint[] = [where("user_id", "==", userId)];

  filters?.forEach(filter => {
    whereParams.push(where(filter.id, filter.operator, filter.value));
  });

  const searchParams = query(collection(db, "purchases"), ...whereParams);

  const result = await getDocs(searchParams);

  const purchaseData: IPurchaseProps[] = result.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    } as IPurchaseProps;
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
    purchase_items: purchase.purchase_items,
    end_date: purchase.end_date,
    total_price: purchase.total_price
  });
}
