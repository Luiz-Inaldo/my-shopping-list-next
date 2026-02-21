"use server";
import { cookies } from "next/headers";

export async function deleteAuthToken() {
    (await cookies()).delete('authToken');
}