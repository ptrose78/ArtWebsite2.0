import { NextResponse } from 'next/server';
import admin from '../../../../firebaseAdmin'; // Import Firebase Admin

export async function POST(req: Request) {
    const { token, password } = await req.json();
    console.log("token", token);
    console.log("password", password);

    if (!token || !password) {
        return NextResponse.json({ success: false, message: "Token and password are required." }, { status: 400 });
    }

    try {
        // Verify the token and get the user's email
        const decodedToken = Buffer.from(token, 'hex').toString('utf-8');
        console.log("decodedToken", decodedToken);
        const [email, uid] = decodedToken.split(':');
        console.log("email", email);
        console.log("uid", uid);

        if (!email || !uid) {
            return NextResponse.json({ success: false, message: "Invalid or expired token." }, { status: 400 });
        }

        // Update the user's password in Firebase Authentication
        await admin.auth().updateUser(uid, {
            password: password,
        });

        return NextResponse.json({ success: true, message: "Password updated successfully!" });

    } catch (error: any) {
        console.error("Password reset error:", error);
        if (error.code === 'auth/user-not-found' || error.message.includes("Cannot read properties of undefined (reading 'split')")) { //added second error check for malformed token
            return NextResponse.json({ success: false, message: "Invalid or expired token." }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "An error occurred." }, { status: 500 });
    }
}