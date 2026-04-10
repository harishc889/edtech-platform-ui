import axios, { type AxiosError } from "axios";
import api from "@/lib/api";
import { getErrorMessageFromPayload } from "@/lib/api-error";
import { bffUrl, backendRequest } from "@/lib/backend-api-client";

export interface AuthUser {
  id?: string | number;
  name?: string;
  email?: string;
}

export interface AuthSuccessData {
  token?: string;
  user?: AuthUser;
  message?: string;
}

export interface AuthErrorData {
  message: string;
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
  jsonBody: Record<string, unknown> | undefined,
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
      const axiosError = error as AxiosError<Record<string, unknown>>;
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
        details: error,
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
    { email: email.trim(), password },
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
      name: name.trim(),
      email: email.trim(),
      password,
    },
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
 * GET /api/Auth/me — session cookie.
 * For the dashboard, include this user’s enrollments on the same payload (e.g. `enrollments`, `courses`, or nested `user.enrollments`) so the UI does not need a second request.
 */
export async function fetchCurrentUser(
  options: AuthRequestOptions = {},
): Promise<AuthServiceResponse<AuthUser>> {
  return jsonRequest<AuthUser>("GET", ["Auth", "me"], undefined, options);
}

export { backendRequest, bffUrl };
