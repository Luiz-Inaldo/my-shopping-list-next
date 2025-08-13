import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import { FirebaseError } from "firebase/app";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredentials.user.getIdToken();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24,
    };

    const response = NextResponse.json("OK", {
      status: 200,
      statusText: "Login realizado com sucesso.",
    });

    response.cookies.set("authToken", token, cookieOptions);

    return response;
  } catch (error) {
    if (error instanceof FirebaseError) {
      return new NextResponse("ERROR", { status: 500, statusText: error.code });
    }
  }
}
