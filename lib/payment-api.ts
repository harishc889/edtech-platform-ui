import type {
  ApiResult,
  CsrfTokenResponse,
  PaymentCreateOrderRequestBody,
  PaymentCreateOrderResponse,
  PaymentVerifyRequestBody,
  PaymentVerifyResponse,
} from "@/lib/aspnet-api-types";
import axios, { type AxiosError } from "axios";
import { getErrorMessageFromPayload } from "@/lib/api-error";
import api from "@/lib/api";
import { bffUrl } from "@/lib/backend-api-client";

const GATEWAY_HEADER = { "X-Payment-Gateway": "Razorpay" } as const;
const SKIP_CSRF = process.env.NEXT_PUBLIC_PAYMENT_SKIP_CSRF === "true";

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

async function runBffRequest<T>(
  config: Parameters<typeof api.request<T>>[0],
  fallbackError: string,
): Promise<ApiResult<T>> {
  try {
    const res = await api.request<T>(config);
    return { ok: true, status: res.status, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const ax = error as AxiosError<Record<string, unknown>>;
      const status = ax.response?.status ?? 0;
      const payload = ax.response?.data;
      return {
        ok: false,
        status,
        error: {
          message: getErrorMessageFromPayload(
            payload,
            messageForHttpStatusPayment(status, fallbackError),
          ),
          details: payload ?? ax.message,
        },
      };
    }
    return {
      ok: false,
      status: 0,
      error: { message: "Network error. Please try again.", details: error },
    };
  }
}

/** GET /api/auth/csrf — sets `csrf` cookie; returns JSON `{ csrfToken }`. */
export async function fetchPaymentCsrfToken(): Promise<
  ApiResult<CsrfTokenResponse>
> {
  return runBffRequest<CsrfTokenResponse>(
    {
      method: "GET",
      url: bffUrl("Auth", "csrf"),
    },
    "Could not obtain security token.",
  );
}

export async function createPaymentOrder(
  body: PaymentCreateOrderRequestBody,
  csrfToken: string | null,
): Promise<ApiResult<PaymentCreateOrderResponse>> {
  return runBffRequest<PaymentCreateOrderResponse>(
    {
      method: "POST",
      data: body,
      url: bffUrl("Payment", "create-order"),
      headers: {
        ...GATEWAY_HEADER,
        ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
      },
    },
    "Could not create payment order.",
  );
}

export async function verifyPayment(
  body: PaymentVerifyRequestBody,
  csrfToken: string | null,
): Promise<ApiResult<PaymentVerifyResponse>> {
  return runBffRequest<PaymentVerifyResponse>(
    {
      method: "POST",
      data: body,
      url: bffUrl("Payment", "verify"),
      headers: {
        ...GATEWAY_HEADER,
        ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
      },
    },
    "Could not verify payment.",
  );
}

/**
 * Resolves CSRF token for payment calls, or `null` when skipped via env.
 */
export async function resolvePaymentCsrfToken(): Promise<
  ApiResult<string | null>
> {
  if (SKIP_CSRF) {
    return { ok: true, status: 200, data: null };
  }
  const csrf = await fetchPaymentCsrfToken();
  if (!csrf.ok) {
    return {
      ok: false,
      status: csrf.status,
      error: csrf.error ?? { message: "Could not obtain security token." },
    };
  }
  const token = csrf.data?.csrfToken;
  if (typeof token !== "string" || !token.trim()) {
    return {
      ok: false,
      status: csrf.status,
      error: { message: "Invalid CSRF response from server." },
    };
  }
  return { ok: true, status: csrf.status, data: token };
}
