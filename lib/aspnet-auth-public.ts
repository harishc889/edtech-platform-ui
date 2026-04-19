import type { ApiResult, AuthUser } from "@/lib/aspnet-api-types";
import {
  aspNetPublicRequest,
  parseAspNetPublicErrorPayload,
} from "@/lib/aspnet-public-client";

/**
 * POST `/api/auth/login` — API should set httpOnly `auth_token`; do not rely on JWT in JSON in production.
 */
export async function aspNetPublicLogin(
  email: string,
  password: string,
): Promise<ApiResult<unknown>> {
  const result = await aspNetPublicRequest("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: { email: email.trim(), password },
  });
  if (result.ok) {
    return { ok: true, status: result.status, data: result.data ?? undefined };
  }
  const err = parseAspNetPublicErrorPayload(
    result.data,
    result.status,
    "Login failed.",
  );
  return {
    ok: false,
    status: result.status,
    error: { message: err.message, details: err.details },
  };
}

/** POST `/api/auth/logout` — clears auth cookies on the API origin. */
export async function aspNetPublicLogout(): Promise<ApiResult<unknown>> {
  const result = await aspNetPublicRequest("/api/auth/logout", {
    method: "POST",
  });
  if (result.ok) {
    return { ok: true, status: result.status, data: result.data ?? undefined };
  }
  const err = parseAspNetPublicErrorPayload(
    result.data,
    result.status,
    "Logout failed.",
  );
  return {
    ok: false,
    status: result.status,
    error: { message: err.message, details: err.details },
  };
}

/**
 * GET `/api/auth/me` (or your backend’s current user route) — adjust path if different.
 * Uses cookies only; returns typed user when your API matches this shape.
 */
export async function aspNetPublicFetchCurrentUser(): Promise<
  ApiResult<AuthUser>
> {
  const result = await aspNetPublicRequest<AuthUser>("/api/auth/me", {
    method: "GET",
  });
  if (result.ok) {
    return { ok: true, status: result.status, data: result.data ?? undefined };
  }
  const err = parseAspNetPublicErrorPayload(
    result.data,
    result.status,
    "Could not load account.",
  );
  return {
    ok: false,
    status: result.status,
    error: { message: err.message, details: err.details },
  };
}
