import type { JsonValue } from "@/lib/json-types";

export interface CsrfTokenResponse {
  csrfToken: string;
}

export interface PaymentCreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  courseTitle: string;
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

export interface PaymentVerifyResponse {
  paymentId: number;
  status: "Pending" | "Success" | "Failed" | string;
  amount: number;
  courseId: number;
  paidAt: string | null;
  message: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: { message: string; details?: JsonValue };
}
