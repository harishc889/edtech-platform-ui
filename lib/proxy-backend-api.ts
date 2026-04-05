import { NextRequest, NextResponse } from "next/server";
import { getBackendApiPrefix, getBackendOrigin } from "@/lib/backend-env";

const SEGMENT_RE = /^[a-zA-Z0-9._~-]+$/;

function forwardSetCookies(from: Response, to: NextResponse) {
  const headers = from.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === "function") {
    for (const cookie of headers.getSetCookie()) {
      to.headers.append("Set-Cookie", cookie);
    }
    return;
  }
  const single = from.headers.get("set-cookie");
  if (single) to.headers.append("Set-Cookie", single);
}

function validateSegments(segments: string[]): string | null {
  if (segments.length === 0) {
    return "Path is required after /api/backend.";
  }
  for (const s of segments) {
    if (!s || !SEGMENT_RE.test(s) || s.includes("..")) {
      return "Invalid path segment.";
    }
  }
  return null;
}

/**
 * Proxies the browser → Next.js request to the ASP.NET Core API.
 * Forwards cookies so session/auth cookies work (cookies-only auth).
 */
export async function proxyToAspNetBackend(
  request: NextRequest,
  pathSegments: string[],
): Promise<NextResponse> {
  const bad = validateSegments(pathSegments);
  if (bad) {
    return NextResponse.json({ message: bad }, { status: 400 });
  }

  const origin = getBackendOrigin();
  if (!origin) {
    return NextResponse.json(
      {
        message:
          "API_BASE_URL is not set. Add it to .env.local (e.g. https://localhost:7148).",
      },
      { status: 500 },
    );
  }

  const apiPrefix = getBackendApiPrefix();
  const encodedPath = pathSegments.map((s) => encodeURIComponent(s)).join("/");
  const url = new URL(`${origin}${apiPrefix}/${encodedPath}`);
  url.search = request.nextUrl.search;

  const method = request.method.toUpperCase();
  const headers = new Headers();
  const accept = request.headers.get("accept");
  if (accept) headers.set("Accept", accept);
  else headers.set("Accept", "application/json");

  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("Cookie", cookie);

  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);

  const contentType = request.headers.get("content-type");
  const hasBody = !["GET", "HEAD", "OPTIONS"].includes(method);

  let body: BodyInit | undefined;
  if (hasBody) {
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 0) {
      body = buf;
      if (contentType) headers.set("Content-Type", contentType);
    }
  }

  try {
    const allowInsecureTls =
      process.env.NODE_ENV !== "production" &&
      process.env.API_ALLOW_SELF_SIGNED_TLS === "true";
    if (allowInsecureTls) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    let backendRes = await fetch(url, { method, headers, body });

    // ASP.NET controllers are often PascalCase (e.g. /api/Auth/login).
    // If route casing differs, retry once with a PascalCase controller segment.
    if (backendRes.status === 404 && pathSegments.length > 0) {
      const [controller, ...rest] = pathSegments;
      const pascalController =
        controller.charAt(0).toUpperCase() + controller.slice(1);
      if (pascalController !== controller) {
        const retryPath = [pascalController, ...rest]
          .map((s) => encodeURIComponent(s))
          .join("/");
        const retryUrl = new URL(`${origin}${apiPrefix}/${retryPath}`);
        retryUrl.search = request.nextUrl.search;
        backendRes = await fetch(retryUrl, { method, headers, body });
      }
    }

    const resContentType = backendRes.headers.get("content-type") ?? "";
    const isJson = resContentType.includes("application/json");

    if (isJson) {
      const data = await backendRes.json().catch(() => ({}));
      const res = NextResponse.json(data, { status: backendRes.status });
      forwardSetCookies(backendRes, res);
      return res;
    }

    const text = await backendRes.text().catch(() => "");
    const res = new NextResponse(text, {
      status: backendRes.status,
      headers: {
        "content-type": resContentType || "text/plain; charset=utf-8",
      },
    });
    forwardSetCookies(backendRes, res);
    return res;
  } catch (error) {
    const isDev = process.env.NODE_ENV !== "production";
    const code =
      error && typeof error === "object" && "cause" in error
        ? ((error as { cause?: { code?: string } }).cause?.code ?? undefined)
        : undefined;
    return NextResponse.json(
      {
        message: isDev
          ? `Unable to reach the ASP.NET Core API. Check API_BASE_URL, API_ALLOW_SELF_SIGNED_TLS, and restart dev server.${code ? ` Error: ${code}` : ""}`
          : "Unable to reach the ASP.NET Core API. Check API_BASE_URL and that the API is running.",
      },
      { status: 502 },
    );
  }
}
