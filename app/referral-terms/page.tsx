import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Referral Program Terms | LA Bim Solutions",
  description: "Terms and conditions for the referral program.",
};

export default function ReferralTermsPage() {
  return (
    <LegalPageShell
      badge="Referral"
      title="Terms & Conditions for Referral Program"
      description="Referral rewards, eligibility criteria, and payout timelines are governed by program rules communicated at the time of participation. The company reserves the right to modify or discontinue the referral program as needed."
    />
  );
}