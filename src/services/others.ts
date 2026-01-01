import { auth } from "@/lib/firebase";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

/**
 * Deleta a conta do usuário, e todas as suas compras e listas.
 */
export async function deleteUserAccount(currentPassword: string) {
  const user = auth.currentUser;
  if (!user) return;
  
  const credential = EmailAuthProvider.credential(
    user?.email || "",
    currentPassword
  );
  await reauthenticateWithCredential(user, credential);
  await deleteUser(user);
}