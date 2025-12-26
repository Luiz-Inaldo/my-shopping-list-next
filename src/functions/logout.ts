"use server";
import { auth } from "@/lib/firebase";
import { APP_ROUTES } from "@/routes/app-routes";
import { signOut } from "firebase/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function LogOut() {
    await signOut(auth);
    cookies().delete('authToken');
    redirect(APP_ROUTES.public.inicio.name);
}