import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | LA Bim Solutions",
  description: "Privacy practices and data handling information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      badge="Policy"
      title="Privacy Policy"
      description="We collect only the information required to provide our services and respond to inquiries. Your personal information is handled securely and is not sold to third parties. Data is used for communication, service delivery, and compliance obligations."
    />
  );
}