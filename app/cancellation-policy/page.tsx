import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Cancellation Policy | LA Bim Solutions",
  description: "Cancellation policy for LA Bim Solutions offerings.",
};

export default function CancellationPolicyPage() {
  return (
    <LegalPageShell
      badge="Policy"
      title="Cancellation Policy"
      description="Cancellation requests are reviewed case-by-case depending on project scope, service milestones, and agreed terms. Please email our team with your order or engagement details to initiate a cancellation request."
    />
  );
}