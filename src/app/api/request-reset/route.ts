import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { storeToken, fetchUserById } from '@/app/lib/data';
import { sendEmail } from '@/app/lib/email'; 

export async function POST(req: Request) {
    const { email } = await req.json();
    console.log('email:', email)
    
    if (!email) {
        return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    // Check if the user exists
    const user = await fetchUserById(email);
    if (!user) {
        return NextResponse.json({ success: false, message: "No account found with this email." }, { status: 400 });
    }

    // Generate a reset token
    const token = randomBytes(32).toString('hex');

    // Store token in the database
    await storeToken(email, token);

    // Create a reset link
    const resetLink = `${process.env.BASE_URL}/admin/auth/reset-password?token=${token}`;

    // Send email
    await sendEmail(email, "Password Reset", `Click here to reset your password: ${resetLink}`);

    return NextResponse.json({ success: true, message: "Password reset link sent to your email." });
}
