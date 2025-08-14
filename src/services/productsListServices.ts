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
} from "firebase/firestore";

export async function getPurchaseList(userId: string) {
  const searchParams = query(
    collection(db, "purchases"),
    where("user_id", "==", userId)
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
  let status: string;
  try {
    await addDoc(collection(db, "purchases"), purchase);
    status = "success";
  } catch (error) {
    console.error("Erro ao adicionar lista:", error);
    status = "error";
  }

  return {
    status
  };
}

export async function deletePurchaseFromDb(purchaseId: string) {
  let status: string;
  try {
    await deleteDoc(doc(db, "purchases", purchaseId));
    status = "success";
  } catch (e) {
    console.error("Erro ao deletar compra:", e);
    status = "error";
  }
  return {
    status
  };
};
