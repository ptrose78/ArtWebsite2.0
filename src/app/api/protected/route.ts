import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// The secret key used to sign the JWT (you should store it securely)

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req: Request) {
    // Get the Authorization header from the incoming request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // If there's no Authorization header or it's in an invalid format
        console.log('no token provided')
        return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];
    console.log(token)

    try {
        // Verify the JWT token
        console.log('verify')

        const decoded = jwt.verify(token, SECRET_KEY);

        // If token is valid, continue with the protected logic
        // For example, you can return some protected data from the server
        return NextResponse.json({ message: 'Protected data', user: decoded }, { status: 200 });
    } catch (error) {
        // If token is invalid or expired
        console.log('Invalid or expired token')
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
}
