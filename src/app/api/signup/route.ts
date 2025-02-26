import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '../../../../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";

const signupFormSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const validatedFields = signupFormSchema.safeParse({
            username: formData.get("username"),
            password: formData.get("password"),
        });

        if (!validatedFields.success) {
            const errors = validatedFields.error.flatten().fieldErrors;
            return NextResponse.json({ errors, message: "Invalid input data", success: false }, { status: 400 });
        }

        const { username, password } = validatedFields.data;

        if (username === process.env.OWNERS_EMAIL) {
            const userCredential = await createUserWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;

            const token = await user.getIdToken();

            const response = NextResponse.json({
                message: "Signup Successful!",
                success: true,
                token: token,
            });

            response.cookies.set("authToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict',
                path: "/",
                maxAge: 15 * 60,
            });

            return response;
        } else {
            return NextResponse.json({ message: "Signup failed", success: false, error: "Invalid email or password" }, { status: 401 });
        }

    } catch (error: any) {
        console.error("Firebase Signup error:", error);
        return NextResponse.json({ message: "Failed to signup: " + error.message, success: false }, { status: 500 });
    }
}