import { trimOrEmpty } from "@/lib/string-trim";

/**
 * ASP.NET Core base URL (Kestrel), e.g. https://localhost:7148 — no trailing slash.
 */
export function getBackendOrigin(): string | null {
  const raw = trimOrEmpty(process.env.API_BASE_URL);
  if (!raw) return null;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

/**
 * API segment prefix on the backend (default matches /api/Auth, /api/Course, …).
 */
export function getBackendApiPrefix(): string {
  const p = trimOrEmpty(process.env.API_PATH_PREFIX) || "/api";
  return p.startsWith("/") ? p : `/${p}`;
}
