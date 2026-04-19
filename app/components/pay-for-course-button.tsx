"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
import { messageForHttpStatus } from "@/lib/aspnet-public-client";
import {
  createPaymentOrder,
  resolvePaymentCsrfToken,
  verifyPayment,
} from "@/lib/payment-api";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

export type PayForCourseButtonProps = {
  /** Numeric course id from the API (not the marketing slug). */
  courseId: number;
  batchId: number;
  onSuccess?: () => void;
  className?: string;
  children?: React.ReactNode;
  /** Disable while parent loads batches / eligibility. */
  disabled?: boolean;
};

/**
 * Full Razorpay flow against ASP.NET Core: CSRF → create-order → checkout.js → CSRF → verify.
 * Requires `NEXT_PUBLIC_API_URL` and an httpOnly `auth_token` cookie on the API origin (log in via the same API base URL).
 */
export default function PayForCourseButton({
  courseId,
  batchId,
  onSuccess,
  className,
  children = "Pay now",
  disabled = false,
}: PayForCourseButtonProps) {
  const [razorpayScriptReady, setRazorpayScriptReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runPayment = useCallback(async () => {
    setError(null);

    if (typeof window === "undefined") return;
    if (!process.env.NEXT_PUBLIC_API_URL?.trim()) {
      setError("Payment is not configured (NEXT_PUBLIC_API_URL).");
      return;
    }

    setBusy(true);
    try {
      const csrf1 = await resolvePaymentCsrfToken();
      if (!csrf1.ok) {
        setError(
          csrf1.error?.message ??
            messageForHttpStatus(csrf1.status, "Could not start payment."),
        );
        return;
      }

      const order = await createPaymentOrder(
        { courseId, batchId },
        csrf1.data ?? null,
      );
      if (!order.ok || !order.data) {
        setError(
          order.error?.message ??
            messageForHttpStatus(order.status, "Could not create order."),
        );
        return;
      }

      const {
        orderId,
        amount,
        currency,
        keyId,
        courseTitle,
      } = order.data;

      if (!window.Razorpay) {
        setError("Payment script is still loading. Please try again.");
        return;
      }

      const amountPaise = Math.round(Number(amount) * 100);

      await new Promise<void>((resolve) => {
        const done = () => resolve();

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
                  setError(
                    csrf2.error?.message ??
                      "Payment succeeded but verification could not start. Contact support with your payment id.",
                  );
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
                  setError(
                    verified.error?.message ??
                      messageForHttpStatus(
                        verified.status,
                        "Payment completed but verification failed.",
                      ),
                  );
                  return;
                }

                onSuccess?.();
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "Verification failed.",
                );
              } finally {
                done();
              }
            })();
          },
          modal: {
            ondismiss: done,
          },
        });

        rzp.on("payment.failed", (...args: unknown[]) => {
          const response = args[0] as
            | { error?: { description?: string } }
            | undefined;
          const msg =
            response?.error?.description ?? "Payment failed. Please try again.";
          setError(msg);
          done();
        });

        rzp.open();
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }, [batchId, courseId, onSuccess]);

  const canClick =
    !disabled &&
    !busy &&
    razorpayScriptReady &&
    Number.isFinite(courseId) &&
    Number.isFinite(batchId);

  return (
    <div className="flex flex-col gap-2">
      <Script
        src={RAZORPAY_SCRIPT}
        strategy="lazyOnload"
        onLoad={() => setRazorpayScriptReady(true)}
      />
      <button
        type="button"
        disabled={!canClick}
        onClick={() => void runPayment()}
        className={
          className ??
          "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {busy ? "Please wait…" : children}
      </button>
      {!razorpayScriptReady && !busy ? (
        <p className="text-xs text-slate-500">Loading secure checkout…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
