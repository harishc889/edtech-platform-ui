/**
 * Typed models for GET /api/Auth/me and related JWT claims.
 * Values are normalized once from JSON in {@link normalizeAuthMePayload}.
 */

import type { JsonValue } from "@/lib/json-types";
import { trimOrEmpty, trimOrUndefined } from "@/lib/string-trim";

/** Parsed `/me` JSON fragment before normalization — not a domain DTO. */
type AuthMeWireObject = { readonly [key: string]: JsonValue };

/** Public profile shape used across header/dashboard — derives from {@link AuthMeUserDto}. */
export type AuthUser = {
  id?: string | number;
  name?: string;
  email?: string;
};

/** One claim entry from the JWT claims array on `/me`. */
export interface AuthMeClaim {
  type: string;
  value: string;
}

/** Certification entry optionally embedded on `/me` or nested under `user`. */
export interface AuthMeCertificationDto {
  id?: number | string;
  title?: string | null;
  name?: string | null;
  certificateName?: string | null;
  certificationName?: string | null;
  issuedOn?: string | null;
  issueDate?: string | null;
  awardedAt?: string | null;
  createdAt?: string | null;
  credentialId?: string | null;
  certificateCode?: string | null;
  verifyUrl?: string | null;
  certificateUrl?: string | null;
  certificateId?: number | string;
  certificationId?: number | string;
}

/** Nested `user` object from `/me`. */
export interface AuthMeUserDto {
  id?: number | string;
  name?: string | null;
  email?: string | null;
  certifications?: AuthMeCertificationDto[];
  certificates?: AuthMeCertificationDto[];
  myCertifications?: AuthMeCertificationDto[];
  myCertificates?: AuthMeCertificationDto[];
}

/** Canonical normalized GET /api/Auth/me document. */
export interface AuthMePayload {
  user: AuthMeUserDto | null;
  claims: AuthMeClaim[];
  /** Legacy root-level role string (some APIs mirror JWT here). */
  role?: string;
  userRole?: string;
  certifications?: AuthMeCertificationDto[];
  certificates?: AuthMeCertificationDto[];
  myCertifications?: AuthMeCertificationDto[];
  myCertificates?: AuthMeCertificationDto[];
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

const CERT_KEYS = [
  "certifications",
  "certificates",
  "myCertifications",
  "myCertificates",
] as const;

function isPlainObject(v: unknown): v is AuthMeWireObject {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function readOptionalString(v: JsonValue | undefined): string | undefined {
  if (typeof v !== "string") return undefined;
  return trimOrUndefined(v);
}

function readOptionalStringNullable(
  v: JsonValue | undefined,
): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null) return null;
  if (typeof v !== "string") return undefined;
  return v;
}

function readId(v: JsonValue | undefined): number | string | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const t = trimOrEmpty(v);
    if (t) return t;
  }
  return undefined;
}

function normalizeClaimsArray(raw: readonly JsonValue[]): AuthMeClaim[] {
  const out: AuthMeClaim[] = [];
  for (const entry of raw) {
    if (!isPlainObject(entry)) continue;
    const type = entry.type;
    const value = entry.value;
    if (typeof type === "string" && typeof value === "string") {
      out.push({ type, value });
    }
  }
  return out;
}

function parseCertDto(r: AuthMeWireObject): AuthMeCertificationDto {
  return {
    id: readId(r.id),
    title: readOptionalStringNullable(r.title),
    name: readOptionalStringNullable(r.name),
    certificateName: readOptionalStringNullable(r.certificateName),
    certificationName: readOptionalStringNullable(r.certificationName),
    issuedOn: readOptionalStringNullable(r.issuedOn),
    issueDate: readOptionalStringNullable(r.issueDate),
    awardedAt: readOptionalStringNullable(r.awardedAt),
    createdAt: readOptionalStringNullable(r.createdAt),
    credentialId: readOptionalStringNullable(r.credentialId),
    certificateCode: readOptionalStringNullable(r.certificateCode),
    verifyUrl: readOptionalStringNullable(r.verifyUrl),
    certificateUrl: readOptionalStringNullable(r.certificateUrl),
    certificateId: readId(r.certificateId),
    certificationId: readId(r.certificationId),
  };
}

function readCertArray(v: JsonValue | undefined): AuthMeCertificationDto[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: AuthMeCertificationDto[] = [];
  for (const item of v) {
    if (!isPlainObject(item)) continue;
    out.push(parseCertDto(item));
  }
  return out.length > 0 ? out : undefined;
}

function firstNonEmptyCertArray(o: AuthMeWireObject): AuthMeCertificationDto[] {
  for (const key of CERT_KEYS) {
    const arr = readCertArray(o[key]);
    if (arr && arr.length > 0) return arr;
  }
  return [];
}

function parseAuthMeUserDto(source: AuthMeWireObject): AuthMeUserDto | null {
  const id = readId(source.id);
  const nameRaw = readOptionalStringNullable(source.name);
  const emailRaw = readOptionalStringNullable(source.email);
  const name =
    nameRaw === undefined
      ? undefined
      : nameRaw === null
        ? null
        : trimOrUndefined(nameRaw) ?? null;
  const email =
    emailRaw === undefined
      ? undefined
      : emailRaw === null
        ? null
        : trimOrUndefined(emailRaw) ?? null;

  const certs = firstNonEmptyCertArray(source);

  const hasCore =
    id !== undefined ||
    (typeof name === "string" && trimOrEmpty(name).length > 0) ||
    (typeof email === "string" && trimOrEmpty(email).length > 0);
  if (!hasCore && certs.length === 0) return null;

  const bucket: AuthMeUserDto = {};
  if (id !== undefined) bucket.id = id;
  if (name !== undefined) bucket.name = name;
  if (email !== undefined) bucket.email = email;
  if (certs.length > 0) bucket.certifications = certs;
  return bucket;
}

/**
 * Whether `type` identifies a role claim. Matches known URIs/names and common
 * JWT suffix patterns (`.../claims/role`).
 */
export function isRoleClaimType(type: string): boolean {
  const trimmed = trimOrEmpty(type);
  const lower = trimmed.toLowerCase();
  for (const known of AUTH_ME_ROLE_CLAIM_TYPES) {
    if (lower === known.toLowerCase()) return true;
  }
  return false;
}

/**
 * Parses GET /api/Auth/me JSON into a stable shape.
 * Supports nested `user`, flat root profile fields, and certification arrays on root or under `user`.
 */
export function normalizeAuthMePayload(raw: unknown): AuthMePayload | null {
  if (!isPlainObject(raw)) return null;

  const claims = Array.isArray(raw.claims)
    ? normalizeClaimsArray(raw.claims as JsonValue[])
    : [];

  let user: AuthMeUserDto | null = null;
  if (raw.user !== undefined && raw.user !== null && isPlainObject(raw.user)) {
    user = parseAuthMeUserDto(raw.user);
  }
  if (!user) {
    user = parseAuthMeUserDto(raw);
  }

  const rootCerts = firstNonEmptyCertArray(raw);

  const payload: AuthMePayload = {
    user,
    claims,
    role: readOptionalString(raw.role),
    userRole: readOptionalString(raw.userRole),
  };

  if (rootCerts.length > 0) {
    payload.certifications = rootCerts;
  }

  return payload;
}

function normalizeClaimType(type: string): string {
  return trimOrEmpty(type).toLowerCase();
}

function claimLooksLikeIdClaim(t: string): boolean {
  const l = normalizeClaimType(t);
  return (
    l === "sub" ||
    l === "userid" ||
    l === "user_id" ||
    l.endsWith("/nameidentifier") ||
    l.endsWith("/objectidentifier")
  );
}

function claimLooksLikeEmailClaim(t: string): boolean {
  const l = normalizeClaimType(t);
  return (
    l === "email" ||
    l === "unique_name" ||
    l === "preferred_username" ||
    l.endsWith("/emailaddress")
  );
}

function claimLooksLikeNameClaim(t: string): boolean {
  const l = normalizeClaimType(t);
  return (
    l === "name" ||
    l === "given_name" ||
    l === "family_name" ||
    l.endsWith("/identity/claims/name")
  );
}

/**
 * Builds {@link AuthUser} from JWT claims when `/me` omits a nested `user`
 * or only exposes identity via standard claim types (OAuth/JWT + MS URIs).
 */
export function authUserFromClaims(claims: readonly AuthMeClaim[]): AuthUser | null {
  let id: string | number | undefined;
  let name: string | undefined;
  let email: string | undefined;
  let givenName: string | undefined;
  let familyName: string | undefined;

  for (const c of claims) {
    const v = trimOrEmpty(typeof c.value === "string" ? c.value : undefined);
    if (!v) continue;
    const t = c.type;

    if (claimLooksLikeIdClaim(t)) {
      if (id === undefined) {
        id = /^\d+$/.test(v) ? Number(v) : v;
      }
    } else if (claimLooksLikeEmailClaim(t)) {
      if (!email) email = v;
    } else if (claimLooksLikeNameClaim(t)) {
      const l = normalizeClaimType(t);
      if (l === "given_name") givenName = v;
      else if (l === "family_name") familyName = v;
      else if (!name) name = v;
    }
  }

  if (!name && (givenName || familyName)) {
    name = trimOrEmpty([givenName, familyName].filter(Boolean).join(" "));
  }

  if (
    id === undefined &&
    !trimOrEmpty(name) &&
    !trimOrEmpty(email)
  ) {
    return null;
  }

  return {
    id,
    name: trimOrUndefined(name),
    email: trimOrUndefined(email),
  };
}

function authUserFromUserDto(u: AuthMeUserDto): AuthUser | null {
  if (
    u.id === undefined &&
    (u.name === undefined || u.name === null || trimOrEmpty(String(u.name)) === "") &&
    (u.email === undefined || u.email === null || trimOrEmpty(String(u.email)) === "")
  ) {
    return null;
  }
  return {
    id: u.id,
    name:
      typeof u.name === "string"
        ? trimOrUndefined(u.name)
        : undefined,
    email:
      typeof u.email === "string"
        ? trimOrUndefined(u.email)
        : undefined,
  };
}

function mergeAuthUserProfiles(
  primary: AuthUser | null,
  fallback: AuthUser | null,
): AuthUser | null {
  const id = primary?.id ?? fallback?.id;
  const name =
    trimOrUndefined(primary?.name) ?? trimOrUndefined(fallback?.name);
  const email =
    trimOrUndefined(primary?.email) ?? trimOrUndefined(fallback?.email);

  if (id === undefined && !name && !email) return null;
  return { id, name, email };
}

/** Maps normalized `/me` payload to the slim profile stored in auth context. */
export function authProfileFromMePayload(me: AuthMePayload | null): AuthUser | null {
  if (!me) return null;
  const fromDto = me.user ? authUserFromUserDto(me.user) : null;
  const fromClaims = authUserFromClaims(me.claims);
  return mergeAuthUserProfiles(fromDto, fromClaims);
}
