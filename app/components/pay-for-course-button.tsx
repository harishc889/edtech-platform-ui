"use client";

import Script from "next/script";
import { useCallback, useRef, useState } from "react";
import {
  RAZORPAY_CHECKOUT_SCRIPT,
  runRazorpayPaymentFlow,
} from "@/lib/razorpay-checkout-flow";

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
 * Requests are sent via Next BFF (`/api/backend/...`) to the ASP.NET API.
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
  const isProcessingRef = useRef(false);

  const runPayment = useCallback(async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setError(null);
    setBusy(true);
    try {
      const result = await runRazorpayPaymentFlow({ courseId, batchId });
      if (result.ok) {
        onSuccess?.();
      } else {
        setError(result.message);
      }
    } finally {
      setBusy(false);
      isProcessingRef.current = false;
    }
  }, [batchId, courseId, onSuccess]);

  const canClick =
    !disabled &&
    !busy &&
    !isProcessingRef.current &&
    razorpayScriptReady &&
    Number.isFinite(courseId) &&
    Number.isFinite(batchId);

  return (
    <div className="flex flex-col gap-2">
      <Script
        src={RAZORPAY_CHECKOUT_SCRIPT}
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
