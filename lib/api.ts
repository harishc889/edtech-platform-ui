import axios from "axios";

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

api.interceptors.request.use((config) => {
  const method = (config.method ?? "get").toLowerCase();
  if (method === "get" || method === "head") {
    config.headers.set("Cache-Control", "no-store");
    config.headers.set("Pragma", "no-cache");
  }
  return config;
});

export default api;

