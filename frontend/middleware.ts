import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const JWT_SECRET = process.env.JWT_SECRET || "secret_key_Ecommerce";

  // Check if user is logged in by looking for auth cookies
  const hasAuthCookie = req.cookies.has("Ecommerce");
  const token = req.cookies.get("Ecommerce")?.value;
  let userRole = "guest";
  // const cookie1 = jwt.verify()
  // const userRole = req.cookies.get("role")?.value || "guest";
  if (token) {
    try {
      // Split JWT into parts
      const payloadBase64 = token.split(".")[1];

      // Add padding if necessary
      const padded = payloadBase64.padEnd(
        payloadBase64.length + ((4 - (payloadBase64.length % 4)) % 4),
        "="
      );

      // Decode Base64URL (replace '-' with '+', '_' with '/')
      const payloadJson = Buffer.from(
        padded.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString();

      const payload = JSON.parse(payloadJson);
      userRole = payload.user?.role || "guest"; // make sure your JWT has user object
      // console.log(userRole, "userRole");
    } catch (err) {
      console.error("Invalid JWT:", err);
    }
  }
  // console.log(userRole,"/")

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

  // If user is not admin but trying to access /admin pages
  if (hasAuthCookie && pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is admin but tries to access non-admin page and you want to redirect them to admin dashboard
  // if (!pathname.startsWith("/admin") && userRole === "admin") {
  //   return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  // }

  console.log(`[MIDDLEWARE] Request allowed: ${pathname}`);
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
