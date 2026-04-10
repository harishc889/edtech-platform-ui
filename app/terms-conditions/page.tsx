import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms & Conditions | LA Bim Solutions",
  description: "Terms and conditions for using LA Bim Solutions services.",
};

export default function TermsConditionsPage() {
  return (
    <LegalPageShell
      badge="Terms"
      title="Terms & Conditions"
      description="By using this website or engaging with our services, you agree to our delivery, billing, communication, and usage terms. Final scope, timeline, and commercial terms are defined in the project-specific agreement."
    />
  );
}