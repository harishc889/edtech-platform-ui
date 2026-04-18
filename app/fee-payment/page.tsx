import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Fee Payment | LA Bim Academy",
  description: "Fee payment information for LA Bim Academy services and programs.",
};

export default function FeePaymentPage() {
  return (
    <LegalPageShell
      badge="Fee Payment"
      title="Fee Payment"
      description="For fee payment assistance, please contact our team before initiating payment. We will share the latest approved payment method, invoice details, and confirmation process."
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-700">
        <p>
          <span className="font-semibold">Phone:</span> +91-7017578290
        </p>
        <p className="mt-2">
          <span className="font-semibold">Email:</span> la@labimsolutions.com
        </p>
      </div>
    </LegalPageShell>
  );
}