/** JSON primitives after `JSON.parse` / typical ASP.NET JSON bodies. */
export type JsonPrimitive = string | number | boolean | null;

/** Serializable JSON tree — use for error payloads and wire envelopes instead of `unknown`. */
export type JsonValue =
  | JsonPrimitive
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };
