/**
 * Centralized null/undefined-safe string trimming for API JSON, env, and optional UI fields.
 *
 * Prefer these helpers over calling `.trim()` on values that may be `null`/`undefined`.
 */

/** `null` / `undefined` → `""`; otherwise `String.prototype.trim()`. */
export function trimOrEmpty(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

/** Like {@link trimOrEmpty}, but empty-after-trim becomes `undefined` (optional props / SEO). */
export function trimOrUndefined(
  value: string | null | undefined,
): string | undefined {
  const t = trimOrEmpty(value);
  return t.length > 0 ? t : undefined;
}
