import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("firebase_token")?.value;
  const { pathname } = request.nextUrl;

  // List of routes you want to protect
  const protectedPaths = [
    "/manage-products",
    "/profile",
    "/wishlist",
    "/manage-products",
    "/add-product",
    "/cart",
  ];

  // Check if current path matches any protected path
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 1. If trying to access protected route and NOT logged in -> Redirect to Login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Save where they wanted to go so we can send them back later
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If User is logged in and tries to visit Login -> Redirect to Dashboard (or Home)
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url)); // Change '/' to '/dashboard' if you have one
  }

  return NextResponse.next();
}

// Only run middleware on these paths
export const config = {
  matcher: [
    "/products/:path*",
    "/add-product",
    "/manage-products",
    "/profile",
    "/login",
    "/register",
    "/wishlist",
    "/cart",
  ],
};
