import { db } from "@/lib/firebase";
import { IEditItemProps, IProductProps, IPurchaseProps } from "@/types";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";

/**
 * @description Gets a specific purchase by its ID
 * @param {string} purchaseId - The ID of the purchase document
 * @returns {Promise<{data: IPurchaseProps | null}>}
 */
export async function getProductsList(purchaseId: string): Promise<{data: IPurchaseProps | null}> {
  const purchaseRef = doc(db, "purchases", purchaseId);
  const purchaseSnap = await getDoc(purchaseRef);

  if (purchaseSnap.exists()) {
    const purchaseData = {
      id: purchaseSnap.id,
      ...purchaseSnap.data(),
    } as IPurchaseProps;

    return {
      data: purchaseData,
    };
  }

  return {
    data: null,
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
 * @param {IProductProps[]} purchaseItems - The data of the item to be added
 */
export async function addPurchaseItem(
  purchaseId: string,
  purchaseItem: IProductProps
) {
  const purchaseRef = doc(db, "purchases", purchaseId);
  await updateDoc(purchaseRef, {
    purchase_items: arrayUnion(purchaseItem)
  })
}

// /**
//  * @description Marks a purchase item as checked or unchecked in the database
//  * @param {string} purchaseId - The ID of the purchase
//  * @param {string} productId - The ID of the product
//  * @param {boolean} value - Whether the item should be marked as checked or not
//  */
// export async function checkPurchaseItem(purchaseId: string, productId: string, value: boolean) {

//   const itemDocRef = doc(db, "purchases", purchaseId, "purchase_items", productId);

//   await updateDoc(itemDocRef, {
//     checked: value,
//   });
// }


/**
 * @description Updates a purchase item in the database
 * @param {string} purchaseId - The ID of the purchase
 * @param {IProductProps[]} updatedData - The updated data of the items
 */
export async function updatePurchase(purchaseId: string, updatedData: IProductProps[]) {
  const purchaseRef = doc(db, "purchases", purchaseId);

  await updateDoc(purchaseRef, {
    purchase_items: updatedData
  });
}

// /**
//  * @description Deletes a purchase item in the database
//  * @param {string} purchaseId - The ID of the purchase
//  * @param {string} productId - The ID of the product
//  */
// export async function deletePurchaseItem(purchaseId: string, productId: string) {
//   const purchaseRef = doc(db, "purchases", purchaseId);
//   const itemDocRef = doc(db, "purchases", purchaseId, "purchase_items", productId);

//   await deleteDoc(itemDocRef);
//   await updateDoc(purchaseRef, {
//     items_count: increment(-1)
//   });
// }
