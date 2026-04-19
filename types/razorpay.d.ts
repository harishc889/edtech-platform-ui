/**
 * Minimal Razorpay Checkout typings (loaded from checkout.razorpay.com).
 * @see https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/
 */
export interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  [key: string]: unknown;
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, fn: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export {};
