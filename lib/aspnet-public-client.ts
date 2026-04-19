import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  isAxiosError,
} from "axios";
import { getErrorMessageFromPayload } from "@/lib/api-error";

export type AspNetPublicRequestConfig = Omit<AxiosRequestConfig, "baseURL"> & {
  /** When set, sends `X-CSRF-TOKEN` (mutating payment routes when CSRF is enabled). */
  csrfToken?: string | null;
};

let cachedClient: AxiosInstance | null = null;

/**
 * Resolves `NEXT_PUBLIC_API_URL` (no trailing slash). Throws if unset — call only when a public API request is needed.
 */
export function getAspNetPublicBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it to .env.local (no trailing slash), e.g. https://api.example.com",
    );
  }
  return raw.replace(/\/+$/, "");
}

/**
 * Whether `NEXT_PUBLIC_API_URL` is configured (safe for SSR / early returns).
 */
export function isAspNetPublicApiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL?.trim());
}

/**
 * Axios instance: browser → ASP.NET Core on `NEXT_PUBLIC_API_URL`.
 * `withCredentials: true` sends httpOnly cookies (e.g. `auth_token`).
 */
export function getAspNetPublicApi(): AxiosInstance {
  if (!cachedClient) {
    cachedClient = axios.create({
      baseURL: getAspNetPublicBaseUrl(),
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    });

    cachedClient.interceptors.request.use((config) => {
      const method = (config.method ?? "get").toLowerCase();
      if (method === "get" || method === "head") {
        config.headers.set("Cache-Control", "no-store");
        config.headers.set("Pragma", "no-cache");
      }
      return config;
    });
  }
  return cachedClient;
}

/**
 * Low-level request helper: merges optional `X-CSRF-TOKEN`, returns success or error payload (no throw on 4xx/5xx).
 */
export async function aspNetPublicRequest<T = unknown>(
  path: string,
  config: AspNetPublicRequestConfig = {},
): Promise<
  | { ok: true; status: number; data: T | null }
  | { ok: false; status: number; data: unknown }
> {
  const { csrfToken, headers, ...rest } = config;
  const client = getAspNetPublicApi();
  const url = path.startsWith("/") ? path : `/${path}`;

  const mergedHeaders = AxiosHeaders.from(headers as Record<string, string>);
  if (csrfToken) {
    mergedHeaders.set("X-CSRF-TOKEN", csrfToken);
  }
  if (!mergedHeaders.has("Accept")) {
    mergedHeaders.set("Accept", "application/json");
  }

  try {
    const res = await client.request<T>({
      url,
      ...rest,
      headers: mergedHeaders,
    });
    return { ok: true, status: res.status, data: res.data ?? null };
  } catch (e) {
    if (isAxiosError(e)) {
      const status = e.response?.status ?? 0;
      const data = e.response?.data;
      return { ok: false, status, data };
    }
    throw e;
  }
}

/** When `true`, payment flows skip CSRF fetch/headers (local API without CSRF). */
export function shouldSkipPaymentCsrf(): boolean {
  return process.env.NEXT_PUBLIC_PAYMENT_SKIP_CSRF === "true";
}

/**
 * Maps HTTP status to a short user-facing message for payment/auth flows.
 */
export function messageForHttpStatus(status: number, fallback: string): string {
  if (status === 401) return "Please log in to continue.";
  if (status === 400) return "Invalid request. Please try again.";
  if (status === 429) return "Too many requests. Please wait and try again.";
  return fallback;
}

/**
 * Status hints for payment / Razorpay — does **not** assume checkout requires login.
 * 401 usually means the API rejected the call (auth policy, CSRF, or CORS); fix on the server for guest checkout.
 */
export function messageForHttpStatusPayment(
  status: number,
  fallback: string,
): string {
  if (status === 401) {
    return "Payment was rejected (401). Allow anonymous access to payment endpoints on your API, or sign in if your API requires it.";
  }
  if (status === 400) return "Invalid request. Please try again.";
  if (status === 429) return "Too many requests. Please wait and try again.";
  return fallback;
}

export function parseAspNetPublicErrorPayload(
  payload: unknown,
  status: number,
  fallback: string,
): { message: string; details?: unknown } {
  const message = getErrorMessageFromPayload(
    payload,
    messageForHttpStatus(status, fallback),
  );
  return { message, details: payload ?? undefined };
}
