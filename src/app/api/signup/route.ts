// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { neon } from "@neondatabase/serverless";
import bcrypt from 'bcryptjs';
import { fetchUserById } from '@/app/lib/data';
import jwt from "jsonwebtoken";

const signupFormSchema = z.object({
    username: z.string().email(), // Validate as email
    password: z.string().min(6, "Password must be at least 6 characters"), // Validate length
});

const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

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

        if (!process.env.POSTGRES_URL) {
            console.error("Missing POSTGRES_URL environment variable.");
            return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
        }

        const sql = neon(process.env.POSTGRES_URL);

        const existingUser = await fetchUserById(username);
        console.log(existingUser)

        if (!existingUser) {
            return NextResponse.json({ message: "Not authorized!", success: false }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await sql`
            UPDATE users
            SET password = ${hashedPassword}
            WHERE username = ${username}
            RETURNING id
        `;

        const userId = result[0].id;
        const accessToken = jwt.sign({ userId: userId }, SECRET_KEY!, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: userId }, REFRESH_SECRET_KEY!, { expiresIn: '7d' });

        const response = NextResponse.json({ 
            message: "Login Successful!", 
            success: true,
            accessToken,
            refreshToken
         });

        response.cookies.set("authToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: "/",
            maxAge: 15 * 60,
        });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ message: "Failed to signup.", success: false }, { status: 500 });
    }
}