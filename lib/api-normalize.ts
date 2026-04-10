/** Unwrap common ASP.NET / wrapper shapes to an array. */
export function unwrapArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.items)) {
      return o.items as T[];
    }
    if (Array.isArray(o.data)) {
      return o.data as T[];
    }
    if (Array.isArray(o.results)) {
      return o.results as T[];
    }
  }
  return [];
}

export function asRecordList(data: unknown): Record<string, unknown>[] {
  return unwrapArray<Record<string, unknown>>(data).filter(
    (x) => x && typeof x === "object",
  ) as Record<string, unknown>[];
}

/** Profile fields from GET /api/Auth/me (flat or `{ user: { ... } }`). */
export function profileFromMePayload(data: unknown): {
  id?: string | number;
  name?: string;
  email?: string;
} | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  if (o.user && typeof o.user === "object") {
    const u = o.user as Record<string, unknown>;
    return {
      id: u.id as string | number | undefined,
      name: typeof u.name === "string" ? u.name : undefined,
      email: typeof u.email === "string" ? u.email : undefined,
    };
  }
  return {
    id: o.id as string | number | undefined,
    name: typeof o.name === "string" ? o.name : undefined,
    email: typeof o.email === "string" ? o.email : undefined,
  };
}

/**
 * Enrollment rows from the same /me payload (no separate my-courses call).
 * Checks common property names on root and nested `user`.
 */
export function enrollmentsFromMePayload(data: unknown): Record<string, unknown>[] {
  if (!data || typeof data !== "object") return [];
  const o = data as Record<string, unknown>;
  const user =
    o.user && typeof o.user === "object"
      ? (o.user as Record<string, unknown>)
      : null;
  const candidates = [
    o.enrollments,
    o.courses,
    o.enrolledCourses,
    o.myCourses,
    user?.enrollments,
    user?.courses,
    user?.enrolledCourses,
    user?.myCourses,
  ];
  for (const v of candidates) {
    const rows = asRecordList(v);
    if (rows.length > 0) return rows;
  }
  return [];
}
