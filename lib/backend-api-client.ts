import api from "@/lib/api";
/**
 * Browser → Next.js BFF on the Next host (e.g. localhost:3000/api/backend/...) → ASP.NET API_BASE_URL.
 * Backend path = {API_PATH_PREFIX}/{segment}/{segment}/... (default prefix /api).
 * Always use `credentials: "include"` so auth cookies are sent (cookies-only).
 *
 * Examples (segments match your URL style, e.g. lowercase):
 * - `["auth", "login"]` → `…/api/auth/login`
 * - `["auth", "me"]` → `…/api/auth/me`
 * - `["course"]` → `…/api/course`
 * - `["course", "5"]` → `…/api/course/5`
 * - `["batch", "course", courseId]` → `…/api/batch/course/{courseId}`
 */

export const BFF_API_BASE = "/api/backend";

export function bffUrl(...segments: string[]): string {
  if (segments.length === 0) {
    throw new Error("bffUrl: provide at least one path segment (e.g. auth, login).");
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
