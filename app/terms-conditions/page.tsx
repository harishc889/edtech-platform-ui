import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms & Conditions | LA Bim Academy",
  description:
    "Terms and conditions for enrolling in and using LA BIM Academy courses.",
};

export default function TermsConditionsPage() {
  return (
    <LegalPageShell
      badge="Terms"
      title="Terms & Conditions - LA BIM Academy"
      description="Welcome to LA BIM Academy. By enrolling in our courses or using our services, you agree to comply with the following terms and conditions. Please read them carefully."
      maxWidth="5xl"
    >
      <ol className="list-decimal space-y-5 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
        <li>
          <span className="font-semibold text-slate-900">Course Enrollment</span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              Admission to courses is confirmed only after successful
              registration and payment of fees.
            </li>
            <li>
              LA BIM Academy reserves the right to accept or reject any
              application without prior notice.
            </li>
            <li>
              Students must provide accurate personal and educational details
              during enrollment.
            </li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">Fees & Payment</span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              All course fees must be paid as per the payment schedule provided.
            </li>
            <li>
              Fees once paid are non-refundable, except under special
              circumstances approved by management.
            </li>
            <li>
              Any delay in payment may result in suspension of access to classes
              or course materials.
            </li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Course Access & Usage
          </span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              Course materials, including videos, notes, and software training
              content, are for personal learning use only.
            </li>
            <li>
              Sharing, copying, or distributing course content without
              permission is strictly prohibited.
            </li>
            <li>
              Access to online resources may be time-limited depending on the
              course plan.
            </li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Attendance & Participation
          </span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              Students are expected to attend classes regularly and complete
              assignments/projects on time.
            </li>
            <li>
              LA BIM Academy is not responsible for missed sessions due to
              student unavailability.
            </li>
            <li>Recorded sessions (if provided) are for revision purposes only.</li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">Certification</span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              Certificates will be issued upon successful completion of the
              course, including assignments and assessments.
            </li>
            <li>
              The academy reserves the right to withhold certification if course
              requirements are not met.
            </li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">Code of Conduct</span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              Students must maintain professional behavior during classes
              (online/offline).
            </li>
            <li>
              Any misconduct, misuse of resources, or inappropriate behavior may
              lead to termination without refund.
            </li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Software & Technical Requirements
          </span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              Students are responsible for ensuring they have the required
              hardware/software to attend BIM training (e.g., Revit,
              Navisworks, etc.).
            </li>
            <li>
              LA BIM Academy is not liable for technical issues on the
              student&apos;s device.
            </li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Intellectual Property
          </span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              All training content, materials, and branding belong to LA BIM
              Academy.
            </li>
            <li>
              Unauthorized use, reproduction, or commercial use is strictly
              prohibited.
            </li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Limitation of Liability
          </span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              LA BIM Academy is not responsible for job placement guarantees,
              though guidance and support may be provided.
            </li>
            <li>
              We are not liable for any direct or indirect loss resulting from
              the use of our training programs.
            </li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">Changes to Terms</span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              LA BIM Academy reserves the right to update or modify these terms
              at any time.
            </li>
            <li>
              Continued use of services after changes implies acceptance of the
              revised terms.
            </li>
          </ul>
        </li>
      </ol>

      <div className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
        <h2 className="text-lg font-bold text-slate-900">Contact Us</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
          For any queries regarding these Terms & Conditions, feel free to
          contact us. We are happy to assist you with your course-related
          questions and support needs.
        </p>
      </div>
    </LegalPageShell>
  );
}