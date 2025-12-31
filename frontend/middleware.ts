import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if user is logged in by looking for auth cookies
  const hasAuthCookie = req.cookies.has("Ecommerce");
  const token = req.cookies.get("Ecommerce")?.value;
  let userRole = "guest";
  // const cookie1 = jwt.verify()
  // const userRole = req.cookies.get("role")?.value || "guest";
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      // Use atob() which works in Edge Runtime (Buffer doesn't exist in Edge)
      const padded = payloadBase64
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(
          payloadBase64.length + ((4 - (payloadBase64.length % 4)) % 4),
          "="
        );
      const payloadJson = atob(padded);
      const payload = JSON.parse(payloadJson);
      userRole = payload.user?.role || "guest";
    } catch (err) {
      console.error("Invalid JWT:", err);
    }
  }

  if (hasAuthCookie && pathname.startsWith("/user/register")) {
    return NextResponse.redirect(new URL("/user/account", req.url));
  }

  if (!hasAuthCookie && pathname.startsWith("/user/account")) {
    return NextResponse.redirect(new URL("/user/login", req.url));
  }

  if (hasAuthCookie && pathname.startsWith("/user/login")) {
    return NextResponse.redirect(new URL("/user/account", req.url));
  }

  if (!hasAuthCookie && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/user/login", req.url));
  }

  if (hasAuthCookie && pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is admin but tries to access non-admin page and you want to redirect them to admin dashboard
  // if (!pathname.startsWith("/admin") && userRole === "admin") {
  //   return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp).*)",
    // "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
