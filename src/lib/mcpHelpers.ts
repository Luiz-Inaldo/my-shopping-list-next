import { adminDb } from './firebaseAdmin';
import { IPurchaseProps, IProductProps } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import type { TNotification } from '@/types/notifications';

/**
 * Verifica se o usuário é owner ou está em shared_with
 */
export async function checkPurchaseAccess(
  purchaseId: string,
  uid: string
): Promise<{ isOwner: boolean; hasAccess: boolean; purchase: IPurchaseProps | null }> {
  const docRef = adminDb.collection('purchases').doc(purchaseId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return { isOwner: false, hasAccess: false, purchase: null };
  }

  const purchase = { id: doc.id, ...doc.data() } as IPurchaseProps;
  const isOwner = purchase.user_id === uid;
  const isShared = purchase.shared_with?.includes(uid) || false;

  return {
    isOwner,
    hasAccess: isOwner || isShared,
    purchase,
  };
}

/**
 * Lista purchases ativas do usuário (próprias + compartilhadas)
 */
export async function listActivePurchases(uid: string): Promise<IPurchaseProps[]> {
  // Buscar próprias
  const ownSnapshot = await adminDb
    .collection('purchases')
    .where('user_id', '==', uid)
    .where('is_active', '==', true)
    .get();

  // Buscar compartilhadas
  const sharedSnapshot = await adminDb
    .collection('purchases')
    .where('shared_with', 'array-contains', uid)
    .where('is_active', '==', true)
    .get();

  const purchases: IPurchaseProps[] = [];

  ownSnapshot.forEach((doc: any) => {
    purchases.push({ id: doc.id, ...doc.data() } as IPurchaseProps);
  });

  sharedSnapshot.forEach((doc: any) => {
    purchases.push({ id: doc.id, ...doc.data() } as IPurchaseProps);
  });

  return purchases;
}

/**
 * Lista histórico (is_active=false) do usuário
 */
export async function listHistoryPurchases(uid: string): Promise<IPurchaseProps[]> {
  // Buscar próprias
  const ownSnapshot = await adminDb
    .collection('purchases')
    .where('user_id', '==', uid)
    .where('is_active', '==', false)
    .get();

  // Buscar compartilhadas
  const sharedSnapshot = await adminDb
    .collection('purchases')
    .where('shared_with', 'array-contains', uid)
    .where('is_active', '==', false)
    .get();

  const purchases: IPurchaseProps[] = [];

  ownSnapshot.forEach((doc: any) => {
    purchases.push({ id: doc.id, ...doc.data() } as IPurchaseProps);
  });

  sharedSnapshot.forEach((doc: any) => {
    purchases.push({ id: doc.id, ...doc.data() } as IPurchaseProps);
  });

  return purchases;
}

/**
 * Cria uma nova purchase
 */
export async function createPurchase(
  uid: string,
  title: string,
  maxValue: number
): Promise<IPurchaseProps> {
  const now = Timestamp.now();
  
  const purchase: any = {
    title,
    user_id: uid,
    max_value: maxValue,
    total_price: 0,
    is_active: true,
    start_date: now,
    end_date: null,
    purchase_items: [],
    shared_with: [],
  };

  const docRef = await adminDb.collection('purchases').add(purchase);
  return { id: docRef.id, ...purchase };
}

/**
 * Atualiza uma purchase (apenas title e max_value)
 */
export async function updatePurchase(
  purchaseId: string,
  uid: string,
  updates: { title?: string; max_value?: number }
): Promise<void> {
  const { hasAccess } = await checkPurchaseAccess(purchaseId, uid);
  if (!hasAccess) {
    throw new Error('Acesso negado');
  }

  const docRef = adminDb.collection('purchases').doc(purchaseId);
  await docRef.update(updates);
}

/**
 * Adiciona itens em batch
 */
export async function addPurchaseItems(
  purchaseId: string,
  uid: string,
  items: Omit<IProductProps, 'id'>[]
): Promise<void> {
  const { hasAccess, purchase } = await checkPurchaseAccess(purchaseId, uid);
  if (!hasAccess || !purchase) {
    throw new Error('Acesso negado');
  }

  const newItems: IProductProps[] = items.map((item) => ({
    ...item,
    id: uuidv4(),
  }));

  const updatedItems = [...(purchase.purchase_items || []), ...newItems];
  
  const docRef = adminDb.collection('purchases').doc(purchaseId);
  await docRef.update({ purchase_items: updatedItems });
}

/**
 * Atualiza um item
 */
export async function updatePurchaseItem(
  purchaseId: string,
  uid: string,
  itemId: string,
  updates: Partial<Omit<IProductProps, 'id'>>
): Promise<void> {
  const { hasAccess, purchase } = await checkPurchaseAccess(purchaseId, uid);
  if (!hasAccess || !purchase) {
    throw new Error('Acesso negado');
  }

  const items = purchase.purchase_items || [];
  const itemIndex = items.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    throw new Error('Item não encontrado');
  }

  items[itemIndex] = { ...items[itemIndex], ...updates };

  const docRef = adminDb.collection('purchases').doc(purchaseId);
  await docRef.update({ purchase_items: items });
}

/**
 * Remove um item
 */
export async function removePurchaseItem(
  purchaseId: string,
  uid: string,
  itemId: string
): Promise<void> {
  const { hasAccess, purchase } = await checkPurchaseAccess(purchaseId, uid);
  if (!hasAccess || !purchase) {
    throw new Error('Acesso negado');
  }

  const items = purchase.purchase_items || [];
  const filteredItems = items.filter((item) => item.id !== itemId);

  const docRef = adminDb.collection('purchases').doc(purchaseId);
  await docRef.update({ purchase_items: filteredItems });
}

/**
 * Marca/desmarca um item
 */
export async function toggleItemCheck(
  purchaseId: string,
  uid: string,
  itemId: string,
  checked: boolean
): Promise<void> {
  await updatePurchaseItem(purchaseId, uid, itemId, { checked });
}

/**
 * Finaliza uma purchase (is_active=false, calcula total_price)
 */
export async function finishPurchase(purchaseId: string, uid: string): Promise<void> {
  const { hasAccess, purchase } = await checkPurchaseAccess(purchaseId, uid);
  if (!hasAccess || !purchase) {
    throw new Error('Acesso negado');
  }

  const items = purchase.purchase_items || [];
  const totalPrice = items.reduce((sum, item) => {
    if (!item.checked) return sum;
    const value = typeof item.value === 'string' ? parseFloat(item.value) : item.value;
    const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity;
    return sum + (value * quantity);
  }, 0);

  const docRef = adminDb.collection('purchases').doc(purchaseId);
  await docRef.update({
    is_active: false,
    end_date: Timestamp.now() as any,
    total_price: Math.round(totalPrice * 100) / 100,
  });
}

/**
 * Deleta uma purchase do histórico (apenas owner)
 */
export async function deleteHistoryPurchase(
  purchaseId: string,
  uid: string
): Promise<void> {
  const { isOwner, purchase } = await checkPurchaseAccess(purchaseId, uid);
  if (!isOwner || !purchase) {
    throw new Error('Acesso negado');
  }

  if (purchase.is_active) {
    throw new Error('Não é possível deletar uma purchase ativa');
  }

  const docRef = adminDb.collection('purchases').doc(purchaseId);
  await docRef.delete();
}

/**
 * Busca UID por username
 */
export async function getUserIdByUsername(username: string): Promise<string | null> {
  const snapshot = await adminDb.collection('usernames').doc(username).get();
  if (!snapshot.exists) {
    return null;
  }
  const data = snapshot.data();
  return data?.uuid || null;
}

/**
 * Busca informações do usuário
 */
export async function getUserInfo(userId: string): Promise<{
  id: string;
  name: string;
  profile_img: string;
} | null> {
  const snapshot = await adminDb.collection('users').doc(userId).get();
  if (!snapshot.exists) {
    return null;
  }
  const data = snapshot.data();
  return {
    id: userId,
    name: data?.name || 'Unknown',
    profile_img: data?.profile_img || '',
  };
}

/**
 * Cria notificações de compartilhamento
 */
async function createShareNotifications(
  userIds: string[],
  senderInfo: { id: string; name: string; profile_img: string },
  listName: string,
  purchaseId: string
): Promise<void> {
  const body = `${senderInfo.name} compartilhou a lista ${listName} com você!`;
  const batch = adminDb.batch();

  userIds.forEach((userId) => {
    const notifRef = adminDb.collection('notifications').doc();
    batch.set(notifRef, {
      body,
      created_at: Timestamp.now() as any,
      is_read: false,
      metadata: { purchase_id: purchaseId },
      sender_info: senderInfo,
      target_id: userId,
      title: 'Uma lista foi compartilhada.',
    } satisfies Omit<TNotification, 'id'>);
  });

  await batch.commit();
}

/**
 * Compartilha uma purchase com usuários (apenas owner, por username)
 */
export async function sharePurchaseWithUsers(
  purchaseId: string,
  uid: string,
  usernames: string[]
): Promise<{ shared: string[]; notFound: string[] }> {
  const { isOwner, purchase } = await checkPurchaseAccess(purchaseId, uid);
  if (!isOwner || !purchase) {
    throw new Error('Acesso negado');
  }

  const senderInfo = await getUserInfo(uid);
  if (!senderInfo) {
    throw new Error('Informações do usuário não encontradas');
  }

  const shared: string[] = [];
  const notFound: string[] = [];
  const userIdsToAdd: string[] = [];

  for (const username of usernames) {
    const userId = await getUserIdByUsername(username);
    if (userId) {
      // Não adicionar se já estiver compartilhado
      if (!purchase.shared_with?.includes(userId) && userId !== uid) {
        userIdsToAdd.push(userId);
        shared.push(username);
      }
    } else {
      notFound.push(username);
    }
  }

  if (userIdsToAdd.length > 0) {
    const docRef = adminDb.collection('purchases').doc(purchaseId);
    const currentSharedWith = purchase.shared_with || [];
    await docRef.update({
      shared_with: [...currentSharedWith, ...userIdsToAdd],
    });

    // Criar notificações
    await createShareNotifications(
      userIdsToAdd,
      senderInfo,
      purchase.title,
      purchaseId
    );
  }

  return { shared, notFound };
}

/**
 * Remove usuários do compartilhamento (apenas owner)
 */
export async function unsharePurchase(
  purchaseId: string,
  uid: string,
  usernames: string[]
): Promise<{ unshared: string[]; notFound: string[] }> {
  const { isOwner, purchase } = await checkPurchaseAccess(purchaseId, uid);
  if (!isOwner || !purchase) {
    throw new Error('Acesso negado');
  }

  const unshared: string[] = [];
  const notFound: string[] = [];
  const userIdsToRemove: string[] = [];

  for (const username of usernames) {
    const userId = await getUserIdByUsername(username);
    if (userId) {
      if (purchase.shared_with?.includes(userId)) {
        userIdsToRemove.push(userId);
        unshared.push(username);
      }
    } else {
      notFound.push(username);
    }
  }

  if (userIdsToRemove.length > 0) {
    const docRef = adminDb.collection('purchases').doc(purchaseId);
    const currentSharedWith = purchase.shared_with || [];
    const newSharedWith = currentSharedWith.filter(
      (id) => !userIdsToRemove.includes(id)
    );
    await docRef.update({ shared_with: newSharedWith });
  }

  return { unshared, notFound };
}
