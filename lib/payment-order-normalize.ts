import type { PaymentCreateOrderResponse } from "@/lib/aspnet-api-types";

function str(v: unknown): string | undefined {
  if (typeof v === "string" && v.trim()) return v.trim();
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return undefined;
}

/**
 * ASP.NET may serialize PascalCase; some APIs use `key` instead of `keyId`.
 * Razorpay requires a non-empty `key` — if missing, checkout loads `.../build/undefined` (403).
 */
export function normalizePaymentOrderForCheckout(
  data: PaymentCreateOrderResponse | Record<string, unknown>,
):
  | Pick<
      PaymentCreateOrderResponse,
      "orderId" | "amount" | "currency" | "keyId" | "courseTitle"
    >
  | null {
  const r = data as Record<string, unknown>;

  const keyId =
    str(r.keyId) ??
    str(r.key) ??
    str(r.KeyId) ??
    str(r.razorpayKeyId);

  const orderId =
    str(r.orderId) ?? str(r.OrderId) ?? str(r.order_id) ?? "";

  const amountRaw = r.amount ?? r.Amount;
  const amount =
    typeof amountRaw === "number"
      ? amountRaw
      : typeof amountRaw === "string"
        ? Number.parseFloat(amountRaw)
        : Number.NaN;

  const currency = str(r.currency) ?? str(r.Currency) ?? "INR";
  const courseTitle =
    str(r.courseTitle) ?? str(r.CourseTitle) ?? "Course payment";

  if (!keyId || !orderId || !Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return {
    orderId,
    amount,
    currency,
    keyId,
    courseTitle,
  };
}
