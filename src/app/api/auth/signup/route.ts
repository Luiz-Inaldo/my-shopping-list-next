import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

export async function POST(request: NextRequest) {
  const { email, password, username: profileUsername } = await request.json();
  const registerFromAdmin =
    request.nextUrl.searchParams.get("admin") === "true";

  try {
    // Crate user account
    const user = await createUserWithEmailAndPassword(auth, email, password);
    const uid = user.user.uid;

    try {
        // Create user profile in database
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        name: profileUsername,
        role: registerFromAdmin ? "admin" : "user",
        profile_img: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return new NextResponse("OK", {
        status: 201,
        statusText: "Usuario criado com sucesso.",
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new NextResponse("ERROR", { status: 500, statusText: error.code });
      }
    }

  } catch (error) {
    if (error instanceof FirebaseError) {
      return new NextResponse("ERROR", { status: 500, statusText: error.code });
    }
  }
}
