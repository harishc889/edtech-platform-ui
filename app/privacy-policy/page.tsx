import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | LA Bim Academy",
  description:
    "Privacy practices and data handling information for LA BIM Academy.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      badge="Policy"
      title="Privacy Policy - LA BIM Academy"
      description="At LA BIM Academy, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and safeguard your data."
      maxWidth="5xl"
    >
      <ol className="list-decimal space-y-5 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
        <li>
          <span className="font-semibold text-slate-900">
            Information We Collect
          </span>
          <p className="mt-1">
            We may collect the following types of information:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Personal details (Name, Email Address, Phone Number)</li>
            <li>
              Educational and professional information (for course enrollment)
            </li>
            <li>Payment and billing information</li>
            <li>
              Website usage data (cookies, IP address, browser type)
            </li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            How We Use Your Information
          </span>
          <p className="mt-1">Your information is used to:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Process course registrations and provide training services</li>
            <li>Communicate updates, course details, and support</li>
            <li>Improve our website, services, and user experience</li>
            <li>Send promotional offers (only with your consent)</li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Data Protection & Security
          </span>
          <p className="mt-1">
            We implement appropriate security measures to protect your personal
            data from unauthorized access, misuse, or disclosure. Your
            information is stored securely and only accessible to authorized
            personnel.
          </p>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Sharing of Information
          </span>
          <p className="mt-1">
            We do not sell or rent your personal data. However, we may share
            information with:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              Trusted service providers (for payment processing or communication)
            </li>
            <li>Legal authorities if required by law</li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Cookies & Tracking Technologies
          </span>
          <p className="mt-1">
            Our website may use cookies to enhance user experience, analyze
            traffic, and personalize content. You can choose to disable cookies
            through your browser settings.
          </p>
        </li>

        <li>
          <span className="font-semibold text-slate-900">Your Rights</span>
          <p className="mt-1">You have the right to:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Access, update, or delete your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Request details about how your data is used</li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Third-Party Links
          </span>
          <p className="mt-1">
            Our website may contain links to third-party websites. We are not
            responsible for their privacy practices, and we encourage users to
            review their policies.
          </p>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Updates to This Policy
          </span>
          <p className="mt-1">
            LA BIM Academy may update this Privacy Policy from time to time.
            Changes will be posted on this page with an updated revision date.
          </p>
        </li>

        <li>
          <span className="font-semibold text-slate-900">Contact Us</span>
          <p className="mt-1">
            If you have any questions or concerns regarding this Privacy Policy
            or your data, please contact us:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>LA BIM Academy</li>
            <li>Email: la@labimacademy.com</li>
            <li>Phone: +91-7017972890</li>
          </ul>
        </li>
      </ol>
    </LegalPageShell>
  );
}