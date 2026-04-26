type SessionInactivePayload = {
  error?: unknown;
  requiresLogin?: unknown;
  message?: unknown;
};

type ErrorLike = {
  message?: unknown;
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

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return "Your session has expired. Please login again.";
}
