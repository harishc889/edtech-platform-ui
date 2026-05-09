import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEFAULT_COOKIE_NAME = "auth_token";
const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/enroll"];

function buildCsp(nonce: string) {
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:"
    : "script-src 'self' 'unsafe-inline' https:";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-src 'self' https://checkout.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
    "trusted-types default",
  ].join("; ");
}

function withSecurityHeaders(response: NextResponse, csp: string) {
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID()).replace(/=+$/g, "");
  const csp = buildCsp(nonce);

  const cookieName = process.env.AUTH_COOKIE_NAME || DEFAULT_COOKIE_NAME;
  const authCookie = request.cookies.get(cookieName)?.value;

  const isProtected = PROTECTED_PREFIXES.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isProtected && !authCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    const nextPath =
      request.nextUrl.pathname +
      (request.nextUrl.search ? request.nextUrl.search : "");
    loginUrl.searchParams.set("next", nextPath);
    return withSecurityHeaders(NextResponse.redirect(loginUrl), csp);
  }

  return withSecurityHeaders(
    NextResponse.next(),
    csp,
  );
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

