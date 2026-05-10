import {
  isRoleClaimType,
  type AuthMeClaim,
  type AuthMePayload,
} from "@/lib/auth-me-types";
import { trimOrEmpty } from "@/lib/string-trim";

const ADMIN_ROLE_VALUES = new Set(["admin", "superadmin", "administrator"]);

function normalizedLower(s: string): string {
  return trimOrEmpty(s).toLowerCase();
}

function isAdminRoleString(value: string): boolean {
  return ADMIN_ROLE_VALUES.has(normalizedLower(value));
}

/** Role claim values from typed claims (Microsoft URI + other role claim types). */
export function roleValuesFromClaims(claims: readonly AuthMeClaim[]): string[] {
  return claims.filter((c) => isRoleClaimType(c.type)).map((c) => c.value);
}

function adminChecks(me: AuthMePayload): boolean {
  const rootRole = trimOrEmpty(me.role ?? me.userRole);
  if (rootRole && isAdminRoleString(rootRole)) return true;

  const adminRoles = roleValuesFromClaims(me.claims);
  return adminRoles.some(isAdminRoleString);
}

/**
 * True if any JWT role claim or legacy root `role` / `userRole` denotes admin.
 *
 * Expects {@link AuthMePayload} from {@link normalizeAuthMePayload} (e.g. via
 * `fetchCurrentUser`); callers must not pass raw `/me` JSON.
 */
export function isAdminFromMePayload(
  payload: AuthMePayload | null | undefined,
): boolean {
  if (payload == null) return false;
  return adminChecks(payload);
}
