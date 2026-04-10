import axios, { type AxiosError } from "axios";
import api from "@/lib/api";
import { getErrorMessageFromPayload } from "@/lib/api-error";

/**
 * Browser → Next.js BFF (e.g. /api/backend/...) → ASP.NET `{API_PATH_PREFIX}/...`.
 * Cookies: use axios `withCredentials` via `lib/api.ts`.
 *
 * Examples:
 * - `["Auth", "login"]` → …/api/Auth/login
 * - `["Course"]` → …/api/Course
 * - `["Enroll", "my-courses"]` → …/api/Enroll/my-courses
 * - `["Batch", "course", courseId]` → …/api/Batch/course/{courseId}
 */

export const BFF_API_BASE = "/api/backend";

export function bffUrl(...segments: string[]): string {
  if (segments.length === 0) {
    throw new Error("bffUrl: provide at least one path segment (e.g. Course, Enroll).");
  }
  return `${BFF_API_BASE}/${segments.map((s) => encodeURIComponent(s)).join("/")}`;
}

/** Low-level axios request to the BFF. Prefer typed helpers in domain services. */
export async function backendRequest<T = unknown>(
  segments: string[],
  config?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    params?: Record<string, unknown>;
    data?: unknown;
    headers?: Record<string, string>;
  },
): Promise<T> {
  const response = await api.request<T>({
    url: bffUrl(...segments),
    method: config?.method ?? "GET",
    params: config?.params,
    data: config?.data,
    headers: config?.headers,
  });
  return response.data;
}

export type BackendResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string; details?: unknown };

/** Like `backendRequest` but never throws; use in UI layers for list/detail calls. */
export async function backendRequestSafe<T = unknown>(
  segments: string[],
  config?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    params?: Record<string, unknown>;
    data?: unknown;
    headers?: Record<string, string>;
  },
): Promise<BackendResult<T>> {
  try {
    const data = await backendRequest<T>(segments, config);
    return { ok: true, data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const ax = error as AxiosError<Record<string, unknown>>;
      const payload = ax.response?.data ?? null;
      const status = ax.response?.status ?? 0;
      return {
        ok: false,
        status,
        message: getErrorMessageFromPayload(
          payload,
          ax.message || "Request failed.",
        ),
        details: payload ?? undefined,
      };
    }
    return {
      ok: false,
      status: 0,
      message: "Network error. Please check your connection and try again.",
    };
  }
}
