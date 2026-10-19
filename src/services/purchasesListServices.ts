import { db } from "@/lib/firebase";
import { IPurchaseProps } from "@/types";
import { Filters } from "@/types/filters";
import type { TNotification } from "@/types/notifications";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";

function mapPurchaseDocs(
  result: Awaited<ReturnType<typeof getDocs>>
): IPurchaseProps[] {
  return result.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<IPurchaseProps, "id">;
    return { id: docSnap.id, ...data };
  });
}

export async function getPurchasesList(userId: string, filters?: Filters[]) {

  const whereParams: QueryConstraint[] = [where("user_id", "==", userId)];

  filters?.forEach(filter => {
    whereParams.push(where(filter.id, filter.operator, filter.value));
  });

  const searchParams = query(collection(db, "purchases"), ...whereParams);

  const result = await getDocs(searchParams);

  return {
    data: mapPurchaseDocs(result),
  };
};

export async function getSharedPurchasesList(userId: string, filters?: Filters[]) {
  const whereParams: QueryConstraint[] = [
    where("shared_with", "array-contains", userId),
  ];

  filters?.forEach((filter) => {
    whereParams.push(where(filter.id, filter.operator, filter.value));
  });

  const searchParams = query(collection(db, "purchases"), ...whereParams);
  const result = await getDocs(searchParams);

  return {
    data: mapPurchaseDocs(result),
  };
}

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

async function createShareNotifications(
  userIds: string[],
  senderInfo: { id: string; name: string; profile_img: string },
  listName: string,
  purchaseId: string
): Promise<void> {
  const body = `${senderInfo.name} compartilhou a lista ${listName} com você!`;
  const batch = writeBatch(db);

  userIds.forEach((userId) => {
    const notifRef = doc(collection(db, "notifications"));
    batch.set(notifRef, {
      body,
      created_at: Timestamp.now(),
      is_read: false,
      metadata: { purchase_id: purchaseId },
      sender_info: senderInfo,
      target_id: userId,
      title: "Uma lista foi compartilhada.",
    } satisfies Omit<TNotification, "id">);
  });

  await batch.commit();
}

export async function sharePurchaseWithUsers(
  purchaseId: string,
  userIds: string[],
  senderInfo: { id: string; name: string; profile_img: string },
  listName: string
): Promise<void> {
  const docRef = doc(db, "purchases", purchaseId);
  await updateDoc(docRef, {
    shared_with: arrayUnion(...userIds),
  });
  await createShareNotifications(userIds, senderInfo, listName, purchaseId);
}

export async function unlinkUserFromSharedPurchase(
  purchaseId: string,
  userId: string
): Promise<void> {
  const docRef = doc(db, "purchases", purchaseId);
  await updateDoc(docRef, {
    shared_with: arrayRemove(userId),
  });
}
