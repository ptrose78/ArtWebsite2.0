import { NextResponse } from 'next/server';
import admin from '../../../../firebaseAdmin';
import { sendEmail } from '@/app/lib/email';

console.log("admin", admin);

export async function POST(req: Request) {
    const { email } = await req.json();
    console.log('email:', email);

    if (!email) {
        return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    try {
        // Fetch user from Firebase Authentication
        const user = await admin.auth().getUserByEmail(email);
        console.log("user", user);

        // Generate a reset token (email:uid format, hex encoded)
        const combinedString = `${email}:${user.uid}`;
        const token = Buffer.from(combinedString).toString('hex');

        // Create a reset link
        const resetLink = `${process.env.BASE_URL}/admin/auth/reset-password?token=${token}`;

        // Send email
        await sendEmail(email, "Password Reset", `Click here to reset your password: ${resetLink}`);

        return NextResponse.json({ success: true, message: "Password reset link sent to your email." });

    } catch (error: any) {
        console.error("Password reset error:", error);
        if (error.code === 'auth/user-not-found') {
            return NextResponse.json({ success: false, message: "No account found with this email." }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "An error occurred." }, { status: 500 });
    }
}