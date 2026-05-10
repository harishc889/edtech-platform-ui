/**
 * Typed envelope for GET /api/Auth/me — JWT claims + optional embedded user.
 * The API may add other root keys (enrollments, certifications, etc.); those
 * are preserved via {@link AuthMePayload}.
 */

/** One claim entry from the JWT claims array on `/me`. */
export interface AuthMeClaim {
  type: string;
  value: string;
}

/**
 * Documented response shape (your API contract). Role comes through
 * `claims[]` with Microsoft’s standard role claim type URI.
 */
export interface AuthMeResponse {
  user: unknown | null;
  claims: AuthMeClaim[];
}

/** ASP.NET Core / Identity role claim type on JWTs. */
export const AUTH_ME_MICROSOFT_ROLE_CLAIM_TYPE =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" as const;

/** Short name used when issuers emit a compact `role` claim. */
export const AUTH_ME_ROLE_CLAIM_TYPE_SHORT = "role" as const;

/** Explicit aliases — add here if the backend introduces another role claim type string. */
export const AUTH_ME_ROLE_CLAIM_TYPES = [
  AUTH_ME_ROLE_CLAIM_TYPE_SHORT,
  AUTH_ME_MICROSOFT_ROLE_CLAIM_TYPE,
] as const;

/**
 * Whether `type` identifies a role claim. Matches known URIs/names and common
 * JWT suffix patterns (`.../claims/role`).
 */
export function isRoleClaimType(type: string): boolean {
  const trimmed = type.trim();
  const lower = trimmed.toLowerCase();
  for (const known of AUTH_ME_ROLE_CLAIM_TYPES) {
    if (lower === known.toLowerCase()) return true;
  }
  return lower.endsWith("/claims/role") || lower.endsWith("/role");
}

/**
 * Full client `/me` document: known fields plus any additional API properties.
 */
export type AuthMePayload = AuthMeResponse & Record<string, unknown>;

function normalizeClaimsArray(raw: unknown[]): AuthMeClaim[] {
  const out: AuthMeClaim[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    if (typeof row.type !== "string" || typeof row.value !== "string") continue;
    out.push({ type: row.type, value: row.value });
  }
  return out;
}

/**
 * Validates object input and returns a typed payload. Root keys are retained
 * so enrollments and similar fields stay available to {@link profileFromMePayload}.
 *
 * If `claims` is missing or not an array, it is treated as `[]` (no roles).
 */
export function normalizeAuthMePayload(raw: unknown): AuthMePayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const claims = Array.isArray(o.claims) ? normalizeClaimsArray(o.claims) : [];
  const user = "user" in o ? (o.user ?? null) : null;
  return { ...o, user, claims };
}
