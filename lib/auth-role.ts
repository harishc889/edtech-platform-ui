import {
  isRoleClaimType,
  normalizeAuthMePayload,
  type AuthMeClaim,
  type AuthMePayload,
} from "@/lib/auth-me-types";

const ADMIN_ROLE_VALUES = new Set(["admin", "superadmin", "administrator"]);

function normalizedLower(s: string): string {
  return s.trim().toLowerCase();
}

function isAdminRoleString(value: string): boolean {
  return ADMIN_ROLE_VALUES.has(normalizedLower(value));
}

/** Role claim values from typed claims (Microsoft URI + other role claim types). */
export function roleValuesFromClaims(claims: readonly AuthMeClaim[]): string[] {
  return claims.filter((c) => isRoleClaimType(c.type)).map((c) => c.value);
}

/**
 * True if any JWT role claim or legacy root `role` / `userRole` denotes admin.
 */
export function isAdminFromMePayload(payload: AuthMePayload | null | undefined): boolean;
export function isAdminFromMePayload(payload: unknown): boolean;
export function isAdminFromMePayload(payload: unknown): boolean {debugger
  const me = normalizeAuthMePayload(payload);
  if (!me) return false;

  const rootRole =
    typeof me.role === "string"
      ? me.role
      : typeof me.userRole === "string"
        ? me.userRole
        : "";
  if (rootRole && isAdminRoleString(rootRole)) return true;

  let adminRoles = roleValuesFromClaims(me.claims);

  return adminRoles.some(isAdminRoleString);
}
