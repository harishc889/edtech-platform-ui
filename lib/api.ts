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

export default api;

