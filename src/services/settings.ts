import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
  updatePassword,
} from "firebase/auth";
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
      emailPendencies: true
    })

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

  return true;
}
