import axios, { type AxiosError } from "axios";
import api from "@/lib/api";
import { getErrorMessageFromPayload } from "@/lib/api-error";
import {
  normalizeAuthMePayload,
  type AuthMePayload,
  type AuthUser,
} from "@/lib/auth-me-types";
import { bffUrl, backendRequest } from "@/lib/backend-api-client";
import { trimOrEmpty } from "@/lib/string-trim";

export type { AuthUser };

export interface AuthSuccessData {
  token?: string;
  user?: AuthUser;
  message?: string;
}

export interface AuthErrorData {
  message: string;
  /** Untyped axios/network payload — normalize at call sites if needed. */
  details?: unknown;
}

export interface AuthServiceResponse<T = AuthSuccessData> {
  ok: boolean;
  status: number;
  data?: T;
  error?: AuthErrorData;
}

/** Optional override for tests only (defaults to same-origin BFF). */
interface AuthRequestOptions {
  baseUrl?: string;
}

function resolveBffUrl(segments: string[], baseUrl?: string): string {
  if (!baseUrl) return bffUrl(...segments);
  const trimmed = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${trimmed}${bffUrl(...segments)}`;
}

async function jsonRequest<T>(
  method: string,
  segments: string[],
  jsonBody: unknown,
  options: AuthRequestOptions = {},
): Promise<AuthServiceResponse<T>> {
  const url = resolveBffUrl(segments, options.baseUrl);
  try {
    const response = await api.request<T>({
      method,
      url,
      data: jsonBody,
      headers: { Accept: "application/json" },
    });

    return {
      ok: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<unknown>;
      const status = axiosError.response?.status ?? 0;
      const payload = axiosError.response?.data ?? null;
      return {
        ok: false,
        status,
        error: {
          message: getErrorMessageFromPayload(
            payload,
            "Request failed. Please try again.",
          ),
          details: payload ?? axiosError.message,
        },
      };
    }

    return {
      ok: false,
      status: 0,
      error: {
        message: "Network error. Please check your connection and try again.",
        details:
          error instanceof Error ? error.message : undefined,
      },
    };
  }
}

/** POST /api/Auth/login — session cookie is set by ASP.NET (via BFF). */
export async function login(
  email: string,
  password: string,
  options: AuthRequestOptions = {},
): Promise<AuthServiceResponse<AuthSuccessData>> {
  return jsonRequest<AuthSuccessData>(
    "POST",
    ["Auth", "login"],
    { email: trimOrEmpty(email), password },
    options,
  );
}

/** POST /api/Auth/register */
export async function register(
  name: string,
  email: string,
  password: string,
  options: AuthRequestOptions = {},
): Promise<AuthServiceResponse<AuthSuccessData>> {
  return jsonRequest<AuthSuccessData>(
    "POST",
    ["Auth", "register"],
    {
      name: trimOrEmpty(name),
      email: trimOrEmpty(email),
      password,
    },
    options,
  );
}

/** POST /api/Auth/forgot-password */
export async function forgotPassword(
  email: string,
  options: AuthRequestOptions = {},
): Promise<AuthServiceResponse<{ message?: string }>> {
  return jsonRequest<{ message?: string }>(
    "POST",
    ["Auth", "forgot-password"],
    { email: trimOrEmpty(email) },
    options,
  );
}

/** POST /api/Auth/reset-password */
export async function resetPassword(
  token: string,
  newPassword: string,
  options: AuthRequestOptions = {},
): Promise<AuthServiceResponse<{ message?: string }>> {
  return jsonRequest<{ message?: string }>(
    "POST",
    ["Auth", "reset-password"],
    { token: trimOrEmpty(token), newPassword },
    options,
  );
}

/** POST /api/Auth/logout — clears auth cookie on the server. */
export async function logout(
  options: AuthRequestOptions = {},
): Promise<AuthServiceResponse<{ message?: string }>> {
  return jsonRequest<{ message?: string }>(
    "POST",
    ["Auth", "logout"],
    undefined,
    options,
  );
}

/**
 * GET /api/Auth/me — session cookie. Response is normalized to {@link AuthMePayload}.
 */
export async function fetchCurrentUser(
  options: AuthRequestOptions = {},
): Promise<AuthServiceResponse<AuthMePayload>> {
  const res = await jsonRequest<unknown>(
    "GET",
    ["Auth", "me"],
    undefined,
    options,
  );
  if (!res.ok) {
    return { ok: false, status: res.status, error: res.error };
  }
  const me = normalizeAuthMePayload(res.data);
  return {
    ok: true,
    status: res.status,
    data: me ?? undefined,
  };
}

export { backendRequest, bffUrl };
