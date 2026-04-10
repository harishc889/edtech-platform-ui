import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Refund Policy | LA Bim Solutions",
  description: "Refund policy for LA Bim Solutions offerings.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPageShell
      badge="Policy"
      title="Refund Policy"
      description="Refund eligibility depends on service usage, progress status, and agreement terms. Approved refunds, if any, are processed through the original payment method within the applicable processing timeline."
    />
  );
}