import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { fetchUserById } from '@/app/lib/data';

const loginFormSchema = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string()
})

export type LoginState = {
    username: string;
    password: string;
}

const HandleLogin = loginFormSchema.omit({id: true});
const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

export async function POST(req: Request) {
    const formData = await req.formData();

    const validatedFields = HandleLogin.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return NextResponse.json({ message: "Invalid input data", success: false, status: 400 }, { status: 400 });
    }

    const { username, password } = validatedFields.data;

    try {
        const user = await fetchUserById(username);

        if (!user) {
            return NextResponse.json({ message: "User not found", success: false, status: 404 }, { status: 404 });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return NextResponse.json({ message: "Invalid password", success: false, status: 401 }, { status: 401 });
        }

        // Generate Access Token (short-lived)
        const accessToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '15m' });
        console.log("access Token:",accessToken)

        // Generate Refresh Token (long-lived)
        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
        console.log("refresh Token:",refreshToken)

         
         const response = NextResponse.json({ 
            message: "Login Successful!", 
            success: true,
            accessToken,
            refreshToken
         });

         response.cookies.set("authToken", accessToken, {
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: 'strict', // recommended for security
             path: "/",
             maxAge: 15 * 60, // 15 minutes
         });
         console.log('response:',response)
 
         response.cookies.set("refreshToken", refreshToken, {
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: 'strict', // recommended for security
             path: "/",
             maxAge: 7 * 24 * 60 * 60, // 7 days
         });
 
        return response

    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to login.");
    }
}