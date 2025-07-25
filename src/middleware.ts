import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_PAGES = [
  "/sign-in",
  "/create-account",
  "/forgot-password",
  "/reset-password",
];
const ADMIN_ONLY = ["/add-product"];

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token",
  });
  const { pathname } = req.nextUrl;
  if (token && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (ADMIN_ONLY.includes(pathname)) {
    if (!token || token.userType !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/create-account",
    "/forgot-password",
    "/reset-password",
    "/add-product",
  ],
};
