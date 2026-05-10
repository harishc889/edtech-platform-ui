import type { JsonValue } from "@/lib/json-types";

/** ASP.NET list wrappers (`items`, `data`, `results`) — wire shape only. */
type WireListEnvelope = { readonly [key: string]: JsonValue };

/** Unwrap common ASP.NET / wrapper shapes to an array. */
export function unwrapArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const o = data as WireListEnvelope;
    if (Array.isArray(o.items)) {
      return o.items as T[];
    }
    if (Array.isArray(o.data)) {
      return o.data as T[];
    }
    if (Array.isArray(o.results)) {
      return o.results as T[];
    }
    if (Array.isArray(o.courses)) {
      return o.courses as T[];
    }
    const lowered = new Map<string, JsonValue>();
    for (const [k, v] of Object.entries(o)) {
      lowered.set(k.toLowerCase(), v);
    }
    for (const key of ["items", "data", "results", "courses"] as const) {
      const v = lowered.get(key);
      if (Array.isArray(v)) {
        return v as T[];
      }
    }
  }
  return [];
}
