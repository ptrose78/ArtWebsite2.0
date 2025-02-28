import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '../../../../firebaseConfig'; // Import Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase sign-in

const loginFormSchema = z.object({
  username: z.string().email(), // Use email instead of username
  password: z.string(),
});

export async function POST(req: Request) {
  const formData = await req.formData();

  const validatedFields = loginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return NextResponse.json({ message: "Invalid input data", success: false, status: 400 }, { status: 400 });
  }

  const { username, password } = validatedFields.data;

  try {
    if (username === process.env.OWNERS_EMAIL) {
    // Use Firebase sign-in
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;
    console.log("user", user);

    // Get the Firebase JWT
    const token = await user.getIdToken();

    const response = NextResponse.json({
      message: "Login Successful!",
      success: true,
      token: token, // Send the Firebase JWT
    });

    console.log("token", token);
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: "/",
      maxAge: 30 * 60, // 30 minutes
    });

    return response;
    } else {
      return NextResponse.json({ message: "Login failed", success: false, error: "Invalid email or password" }, { status: 401 });
    }

  } catch (error) {
    console.error("Firebase Auth error:", error);
    return NextResponse.json({ message: "Login failed", success: false, error: error.message }, { status: 401 });
  }
}