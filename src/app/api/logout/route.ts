import { NextResponse } from 'next/server';

export async function POST(req: Request) { // Or DELETE
    try {
      const response = new NextResponse(JSON.stringify({ message: "Logout successful!" }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });

        response.cookies.set("authToken", "", { // Clear the authToken cookie
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: "/",
            expires: new Date(0), // Set expiry to the past
        });

        response.cookies.set("refreshToken", "", { // Clear the refreshToken cookie
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: "/",
            expires: new Date(0), // Set expiry to the past
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ message: "Logout failed.", success: false }, { status: 500 });
    }
}