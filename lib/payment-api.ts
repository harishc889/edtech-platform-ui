import type {
  ApiResult,
  CsrfTokenResponse,
  PaymentCreateOrderRequestBody,
  PaymentCreateOrderResponse,
  PaymentVerifyRequestBody,
  PaymentVerifyResponse,
} from "@/lib/aspnet-api-types";
import {
  aspNetPublicRequest,
  parseAspNetPublicErrorPayload,
  shouldSkipPaymentCsrf,
} from "@/lib/aspnet-public-client";

const GATEWAY_HEADER = { "X-Payment-Gateway": "Razorpay" } as const;

async function wrapJson<T>(
  result: Awaited<ReturnType<typeof aspNetPublicRequest<T>>>,
  fallbackError: string,
): Promise<ApiResult<T>> {
  if (result.ok) {
    return { ok: true, status: result.status, data: result.data as T };
  }
  const err = parseAspNetPublicErrorPayload(
    result.data,
    result.status,
    fallbackError,
  );
  return {
    ok: false,
    status: result.status,
    error: { message: err.message, details: err.details },
  };
}

/** GET /api/auth/csrf — sets `csrf` cookie; returns JSON `{ csrfToken }`. */
export async function fetchPaymentCsrfToken(): Promise<
  ApiResult<CsrfTokenResponse>
> {
  const result = await aspNetPublicRequest<CsrfTokenResponse>(
    "/api/auth/csrf",
    { method: "GET" },
  );
  return wrapJson(result, "Could not obtain security token.");
}

export async function createPaymentOrder(
  body: PaymentCreateOrderRequestBody,
  csrfToken: string | null,
): Promise<ApiResult<PaymentCreateOrderResponse>> {
  const result = await aspNetPublicRequest<PaymentCreateOrderResponse>(
    "/api/Payment/create-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...GATEWAY_HEADER,
      },
      data: body,
      csrfToken: csrfToken || undefined,
    },
  );
  return wrapJson(result, "Could not create payment order.");
}

export async function verifyPayment(
  body: PaymentVerifyRequestBody,
  csrfToken: string | null,
): Promise<ApiResult<PaymentVerifyResponse>> {
  const result = await aspNetPublicRequest<PaymentVerifyResponse>(
    "/api/Payment/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...GATEWAY_HEADER,
      },
      data: body,
      csrfToken: csrfToken || undefined,
    },
  );
  return wrapJson(result, "Could not verify payment.");
}

/**
 * Resolves CSRF token for payment calls, or `null` when skipped via env.
 */
export async function resolvePaymentCsrfToken(): Promise<
  ApiResult<string | null>
> {
  if (shouldSkipPaymentCsrf()) {
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
