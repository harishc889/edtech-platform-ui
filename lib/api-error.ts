export function getErrorMessageFromPayload(
  payload: unknown,
  fallback: string,
): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }
  const p = payload as Record<string, unknown>;
  const message = p.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  const detail = p.detail;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }
  const title = p.title;
  if (typeof title === "string" && title.trim()) {
    return title;
  }
  const err = p.error;
  if (typeof err === "string" && err.trim()) {
    return err;
  }
  if (err && typeof err === "object" && "message" in err) {
    const nested = (err as { message?: unknown }).message;
    if (typeof nested === "string" && nested.trim()) {
      return nested;
    }
  }
  return fallback;
}
