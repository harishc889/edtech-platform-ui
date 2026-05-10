import { trimOrEmpty } from "@/lib/string-trim";

export function getErrorMessageFromPayload(
  payload: unknown,
  fallback: string,
): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }
  if ("message" in payload && typeof payload.message === "string") {
    const msg = trimOrEmpty(payload.message);
    if (msg) return msg;
  }
  if ("detail" in payload && typeof payload.detail === "string") {
    const d = trimOrEmpty(payload.detail);
    if (d) return d;
  }
  if ("title" in payload && typeof payload.title === "string") {
    const t = trimOrEmpty(payload.title);
    if (t) return t;
  }
  if ("error" in payload) {
    const err = payload.error;
    if (typeof err === "string") {
      const es = trimOrEmpty(err);
      if (es) return es;
    }
    if (err && typeof err === "object" && "message" in err) {
      const nested = err.message;
      if (typeof nested === "string") {
        const ns = trimOrEmpty(nested);
        if (ns) return ns;
      }
    }
  }
  return fallback;
}
