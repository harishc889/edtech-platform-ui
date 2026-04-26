import axios from "axios";
import { getSessionInactiveMessage } from "@/lib/auth-session-error";

/**
 * Shared axios client for browser -> Next BFF calls.
 * Cookies are always included (httpOnly cookie auth).
 */
const api = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let sessionInactiveHandled = false;

api.interceptors.request.use((config) => {
  const method = (config.method ?? "get").toLowerCase();
  if (method === "get" || method === "head") {
    config.headers.set("Cache-Control", "no-store");
    config.headers.set("Pragma", "no-cache");
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && axios.isAxiosError(error)) {
      const payload =
        error.response && typeof error.response.data === "object"
          ? (error.response.data as Record<string, unknown>)
          : null;
      const message = getSessionInactiveMessage({
        message: error.message,
        details: payload,
      });

      if (message && !sessionInactiveHandled) {
        sessionInactiveHandled = true;
        window.dispatchEvent(
          new CustomEvent("auth:session-inactive", {
            detail: { message },
          }),
        );

        const onLoginPage = window.location.pathname.startsWith("/login");
        if (!onLoginPage) {
          const next =
            window.location.pathname +
            (window.location.search ? window.location.search : "");
          const loginUrl = new URL("/login", window.location.origin);
          loginUrl.searchParams.set("next", next);
          window.location.assign(loginUrl.toString());
        }

        window.setTimeout(() => {
          sessionInactiveHandled = false;
        }, 1500);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

