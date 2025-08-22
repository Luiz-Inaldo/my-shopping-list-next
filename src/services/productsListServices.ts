import { db } from "@/lib/firebase";
import { IEditItemProps, IProductProps } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * @description Gets a purchase list with all its props
 * @param {string} userId - The ID of the user who owns the purchase list
 * @param {string} listName - The title of the purchase list
 * @returns {Promise<{data: IPurchaseProps[]}>}
 */
export async function getProductsList(userId: string, listName: string) {
  const searchParams = query(
    collection(db, "purchases"),
    where("user_id", "==", userId),
    where("title", "==", listName)
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
}

/**
 * @description Gets all the items in a purchase list
 * @param {string} listId - The ID of the purchase list
 * @returns {Promise<{data: IProductProps[]}>}
 */
export async function getProductsListItems(listId: string) {
  const listRef = collection(db, "purchases", listId, "purchase_items");
  const result = await getDocs(listRef);
  
  const purchaseData = result.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  return {
    data: purchaseData,
  };
}

/**
 * @description Adds a new item to a purchase in the database
 * @param {string} purchaseId - The ID of the purchase
 * @param {IProductProps} newItem - The data of the item to be added
 */
export async function addPurchaseItem(
  purchaseId: string,
  newItem: IProductProps
) {
  const purchaseRef = doc(db, "purchases", purchaseId);
  await addDoc(collection(db, "purchases", purchaseId, "purchase_items"), newItem);
  await updateDoc(purchaseRef, {
    items_count: increment(1)
  })
}

/**
 * @description Marks a purchase item as checked or unchecked in the database
 * @param {string} purchaseId - The ID of the purchase
 * @param {string} productId - The ID of the product
 * @param {boolean} value - Whether the item should be marked as checked or not
 */
export async function checkPurchaseItem(purchaseId: string, productId: string, value: boolean) {

  const itemDocRef = doc(db, "purchases", purchaseId, "purchase_items", productId);

  await updateDoc(itemDocRef, {
    checked: value,
  });
}


/**
 * @description Updates a purchase item in the database
 * @param {string} purchaseId - The ID of the purchase
 * @param {string} productId - The ID of the product
 * @param {IEditItemProps} updatedData - The updated data of the item
 */
export async function updatePurchaseItem(purchaseId: string, productId: string, updatedData: IEditItemProps) {
  const itemDocRef = doc(db, "purchases", purchaseId, "purchase_items", productId);

  await updateDoc(itemDocRef, updatedData);
}

/**
 * @description Deletes a purchase item in the database
 * @param {string} purchaseId - The ID of the purchase
 * @param {string} productId - The ID of the product
 */
export async function deletePurchaseItem(purchaseId: string, productId: string) {
  const purchaseRef = doc(db, "purchases", purchaseId);
  const itemDocRef = doc(db, "purchases", purchaseId, "purchase_items", productId);

  await deleteDoc(itemDocRef);
  await updateDoc(purchaseRef, {
    items_count: increment(-1)
  });
}
