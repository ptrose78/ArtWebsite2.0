import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const url = new URL(req.url)

  if (url.pathname.startsWith("/admin")) {
    const authToken = req.cookies.get("authToken")?.value

    if (!authToken) {
      if (
        url.pathname === "/admin/auth/login" ||
        url.pathname === "/admin/auth/signup" ||
        url.pathname === "/admin/auth/forgot-password" ||
        url.pathname === "/admin/auth/reset-password"
      ) {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/admin/auth/login", url.origin))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

