import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Check if the request is for admin routes
  if (url.pathname.startsWith("/admin")) {
    console.log("middleware");

    // Get the access token from the cookie
    const authToken = req.cookies.get("authToken")?.value; // Get the authToken cookie value
    console.log("authToken:", authToken);

    // Check if token exists and is valid (implement token validation logic here)
    if (authToken) {
      return NextResponse.next(); // Allow access if authenticated
    }

     // Check if request is for login and redirect if already on login page
     if (url.pathname === "/admin/auth/login" || url.pathname === "/admin/auth/signup") {
      return NextResponse.next(); // Allow access to login page itself
    }
    
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/admin/auth/login", url.origin));
  }

  return NextResponse.next(); // Allow the request to proceed if not an admin route
}

export const config = {
  matcher: ["/admin/:path*"], // Apply middleware to all admin routes
};