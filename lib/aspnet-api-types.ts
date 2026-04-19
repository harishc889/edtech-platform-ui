/**
 * Types for direct browser → ASP.NET Core API calls (`NEXT_PUBLIC_API_URL`).
 * Paths follow the backend contract (case-sensitive per server config).
 */

/** Current user — align fields with your `/api/auth/me` (or equivalent) payload. */
export interface AuthUser {
  id?: string | number;
  name?: string;
  email?: string;
}

export interface CsrfTokenResponse {
  csrfToken: string;
}

/** Response from POST /api/Payment/create-order */
export interface PaymentCreateOrderResponse {
  orderId: string;
  /** Amount in main currency units (e.g. rupees for INR). */
  amount: number;
  currency: string;
  /** Razorpay key id (public; safe on client). */
  keyId: string;
  courseTitle: string;
  /** Backend payment row id — string or number depending on API. */
  paymentId: string | number;
}

export interface PaymentVerifyRequestBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  batchId: number;
}

export interface PaymentCreateOrderRequestBody {
  courseId: number;
  batchId: number;
}

/** Successful verify response shape — extend when API contract is known. */
export interface PaymentVerifyResponse {
  message?: string;
  success?: boolean;
  [key: string]: unknown;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: { message: string; details?: unknown };
}
