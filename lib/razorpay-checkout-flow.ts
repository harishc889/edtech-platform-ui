import {
  isAspNetPublicApiConfigured,
  messageForHttpStatusPayment,
} from "@/lib/aspnet-public-client";
import { normalizePaymentOrderForCheckout } from "@/lib/payment-order-normalize";
import {
  createPaymentOrder,
  resolvePaymentCsrfToken,
  verifyPayment,
} from "@/lib/payment-api";

export const RAZORPAY_CHECKOUT_SCRIPT =
  "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Ensures `window.Razorpay` exists (injects script once if needed).
 */
export function ensureRazorpayLoaded(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (window.Razorpay) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_CHECKOUT_SCRIPT}"]`,
    );
    if (existing) {
      if (window.Razorpay) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Razorpay script failed to load.")),
      );
      return;
    }
    const s = document.createElement("script");
    s.src = RAZORPAY_CHECKOUT_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay checkout."));
    document.body.appendChild(s);
  });
}

export type RazorpayFlowResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * CSRF → create-order → Razorpay modal → CSRF → verify.
 * Call after form validation; user must be logged in (API cookie on `NEXT_PUBLIC_API_URL`).
 */
export async function runRazorpayPaymentFlow(params: {
  courseId: number;
  batchId: number;
}): Promise<RazorpayFlowResult> {
  const { courseId, batchId } = params;

  if (!isAspNetPublicApiConfigured()) {
    return {
      ok: false,
      message: "Payment is not configured (NEXT_PUBLIC_API_URL).",
    };
  }

  try {
    await ensureRazorpayLoaded();
  } catch (e) {
    return {
      ok: false,
      message:
        e instanceof Error ? e.message : "Could not load payment checkout.",
    };
  }

  if (!window.Razorpay) {
    return {
      ok: false,
      message: "Payment script is still loading. Please try again.",
    };
  }

  try {
    const csrf1 = await resolvePaymentCsrfToken();
    if (!csrf1.ok) {
      return {
        ok: false,
        message:
          csrf1.error?.message ??
          messageForHttpStatusPayment(csrf1.status, "Could not start payment."),
      };
    }

    const order = await createPaymentOrder(
      { courseId, batchId },
      csrf1.data ?? null,
    );
    if (!order.ok || !order.data) {
      return {
        ok: false,
        message:
          order.error?.message ??
          messageForHttpStatusPayment(order.status, "Could not create order."),
      };
    }

    const normalized = normalizePaymentOrderForCheckout(order.data);
    if (!normalized) {
      return {
        ok: false,
        message:
          "Invalid payment session: the server response is missing a Razorpay key or order id. Ensure create-order returns keyId (or key / KeyId) and orderId in JSON.",
      };
    }

    const { orderId, amount, currency, keyId, courseTitle } = normalized;
    const amountPaise = Math.round(Number(amount) * 100);

    const checkoutResult = await new Promise<RazorpayFlowResult>((resolve) => {
      let settled = false;
      const done = (result: RazorpayFlowResult) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };

      const rzp = new window.Razorpay!({
        key: keyId,
        order_id: orderId,
        amount: amountPaise,
        currency: currency || "INR",
        name: courseTitle,
        description: courseTitle,
        handler(response) {
          void (async () => {
            try {
              const csrf2 = await resolvePaymentCsrfToken();
              if (!csrf2.ok) {
                done({
                  ok: false,
                  message:
                    csrf2.error?.message ??
                    "Payment succeeded but verification could not start. Contact support with your payment id.",
                });
                return;
              }

              const verified = await verifyPayment(
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  batchId,
                },
                csrf2.data ?? null,
              );

              if (!verified.ok) {
                done({
                  ok: false,
                  message:
                    verified.error?.message ??
                    messageForHttpStatusPayment(
                      verified.status,
                      "Payment completed but verification failed.",
                    ),
                });
                return;
              }

              done({ ok: true });
            } catch (e) {
              done({
                ok: false,
                message:
                  e instanceof Error ? e.message : "Verification failed.",
              });
            }
          })();
        },
        modal: {
          ondismiss() {
            done({ ok: false, message: "Payment was cancelled." });
          },
        },
      });

      rzp.on("payment.failed", (...args: unknown[]) => {
        const response = args[0] as
          | { error?: { description?: string } }
          | undefined;
        const msg =
          response?.error?.description ?? "Payment failed. Please try again.";
        done({ ok: false, message: msg });
      });

      rzp.open();
    });

    return checkoutResult;
  } catch (e) {
    return {
      ok: false,
      message:
        e instanceof Error ? e.message : "Something went wrong. Try again.",
    };
  }
}
