import { auth, db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { FirebaseError } from "firebase/app";

/**
 * Altera o nome do usuário no documento do Firestore.
 * @param {string} userId - O ID do documento (geralmente o uid do Firebase Auth).
 * @param {string} newName - O novo nome a ser definido.
 */
export async function updateUserName(userId: string, newName: string) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    name: newName,
    updated_at: new Date(),
  });
}

/**
 * Altera a foto de perfil do usuário.
 * @param {string} userId - O ID do documento (geralmente o uid do Firebase Auth).
 * @param {File} image - A imagem a ser definida.
 */
export async function updateProfileImage(userId: string, image: File) {
  const userRef = doc(db, "users", userId);

  const storageRef = ref(storage, `profile_images/${userId}/profile_img`);
  await uploadBytes(storageRef, image);
  const downloadURL = await getDownloadURL(storageRef);

  await updateDoc(userRef, {
    profile_img: downloadURL,
    updated_at: new Date(),
  });
}

/**
 * Remove a foto de perfil do usuário.
 * @param {string} userId - O ID do usuário.
 */
export async function removeProfileImage(userId: string) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    profile_img: "",
    updated_at: new Date(),
  });
}

/**
 * Altera o e-mail do usuário, exige revalidação, e envia e-mail de confirmação.
 * @param {string} currentPassword - A senha atual do usuário.
 * @param {string} newEmail - O novo e-mail a ser definido.
 */
export async function updateUserEmail(
  currentPassword: string,
  newEmail: string
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const credential = EmailAuthProvider.credential(
    user?.email || "",
    currentPassword
  );

  try {
    await reauthenticateWithCredential(user, credential);

    await verifyBeforeUpdateEmail(user, newEmail);

    await sendEmailVerification(user);

    await updateDoc(doc(db, "users", user.uid), {
      updated_at: new Date(),
    });
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Erro ao trocar o e-mail:", error.code, error.message);
      throw error;
    }
  }
}

/**
 * Altera o e-mail do usuário, exige revalidação, e envia e-mail de confirmação.
 * @param {string} currentPassword - A senha atual do usuário.
 * @param {string} newPassword - O novo e-mail a ser definido.
 */
export async function updateUserPassword(
  currentPassword: string,
  newPassword: string
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const credential = EmailAuthProvider.credential(
    user?.email || "",
    currentPassword
  );

  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);

  await updateDoc(doc(db, "users", user.uid), {
    updated_at: new Date(),
  });

  return true;
}

async function deleteUserPurchases(userId: string) {
  const q = query(collection(db, "purchases"), where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);

  if (querySnapshot.empty) {
    console.log("Nenhuma compra encontrada para este usuário.");
    return;
  }

  querySnapshot.forEach((purchase) => {
    batch.delete(purchase.ref);
  });

  await batch.commit();
}

async function updateUserActiveStatus(userId: string) {
  const userDocRef = doc(db, "users", userId);

  await updateDoc(userDocRef, {
    active: false,
  });
}

export async function deleteUsernameDoc(userName: string) {
  if (!userName) {
    console.error("Nenhum nome de usuário foi declarado");
    return;
  }
  const userNameDocRef = await getDoc(doc(db, "usernames", userName));

  if (!userNameDocRef) {
    console.error("Não existe referência para essa chamada: 'usernames'");
  }

  deleteDoc(userNameDocRef.ref);
}

/**
 * Deleta a conta do usuário, e todas as suas compras e listas.
 * @param {string} currentPassword - A senha atual do usuário.
 */
export async function deleteUserAccount(userObj: {
  uid: string;
  username: string;
}) {
  const user = auth.currentUser;
  if (!user) {
    console.error(
      "Não foi possível completar a requisição. Usuário não encontrado."
    );
    return;
  }

  // Deleta:
  // Listas do usuário | username da coleção unique
  // Modifica:
  // Status do usuário para inativo
  await Promise.allSettled([
    deleteUserPurchases(userObj.uid),
    updateUserActiveStatus(userObj.uid),
    deleteUsernameDoc(userObj.username),
  ]).then((results) => {
    results.forEach((result, idx) => {
      if (result.status === "rejected") {
        console.error(
          `Houve um erro na requisição ${idx + 1}. Motivo: ${result.reason}`
        );
      }
    });
  });

  // deleta o usuário do firebase auth
  await deleteUser(user);
}

export async function reautenticateUser(currentPassword: string) {
  const user = auth.currentUser;
  if (!user) {
    console.error(
      "Não foi possível completar a requisição. Usuário não encontrado."
    );
    return false;
  }

  const credential = EmailAuthProvider.credential(
    user?.email || "",
    currentPassword
  );

  // reautenticação para comprovar usuário
  await reauthenticateWithCredential(user, credential);

  return true;
}
