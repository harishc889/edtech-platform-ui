import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEFAULT_COOKIE_NAME = "auth_token";
const PROTECTED_PREFIXES = ["/dashboard", "/profile"];

export function proxy(request: NextRequest) {
  const cookieName = process.env.AUTH_COOKIE_NAME || DEFAULT_COOKIE_NAME;
  const authCookie = request.cookies.get(cookieName)?.value;

  const isProtected = PROTECTED_PREFIXES.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isProtected && !authCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};

