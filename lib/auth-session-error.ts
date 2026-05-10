type SessionInactivePayload = {
  error?: string;
  requiresLogin?: boolean;
  message?: string;
};

import { trimOrEmpty } from "@/lib/string-trim";

type ErrorLike = {
  message?: string;
  details?: unknown;
};

/**
 * Returns a user-facing inactive-session message when backend indicates
 * SESSION_INACTIVE / requiresLogin=true; otherwise returns null.
 */
export function getSessionInactiveMessage(
  error?: ErrorLike,
): string | null {
  const details = error?.details;
  if (!details || typeof details !== "object") return null;

  const payload = details as SessionInactivePayload;
  const isInactiveSession = payload.error === "SESSION_INACTIVE";
  const requiresLogin = payload.requiresLogin === true;
  if (!isInactiveSession && !requiresLogin) return null;

  if (typeof payload.message === "string") {
    const m = trimOrEmpty(payload.message);
    if (m) return m;
  }

  if (typeof error?.message === "string") {
    const m = trimOrEmpty(error.message);
    if (m) return m;
  }

  return "Your session has expired. Please login again.";
}
