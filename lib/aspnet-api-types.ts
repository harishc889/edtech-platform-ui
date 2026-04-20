export interface AuthUser {
  id?: string | number;
  name?: string;
  email?: string;
}

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
