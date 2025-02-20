import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { findEmailByToken, updateUserPassword, removeToken } from '@/app/lib/data';

export async function POST(req: Request) {
    const { token, password } = await req.json();

    if (!token || !password) {
        return NextResponse.json({ success: false, message: "Token and password are required." }, { status: 400 });
    }

    // Find the email associated with this token
    const email = await findEmailByToken(token);
   

    if (email.rowCount === 0) {
        return NextResponse.json({ success: false, message: "Invalid or expired token." }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update the user's password
    const updateUserPasswordResult = await updateUserPassword(email, hashedPassword);
    

    // Remove the token from the database
    const removeTokenResult = await removeToken(token);
    
    return NextResponse.json({ success: true, message: "Password updated successfully!" });
}
