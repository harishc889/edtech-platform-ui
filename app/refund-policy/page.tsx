import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Refund Policy | LA Bim Academy",
  description:
    "Refund policy for LA BIM Academy courses, enrollments, and batch transfers.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPageShell
      badge="Policy"
      title="Refund Policy - LA BIM Academy"
      description="At LA BIM Academy, we are committed to delivering high-quality BIM training and ensuring transparency in all financial transactions. Please read our refund policy carefully before enrolling in any course."
      maxWidth="5xl"
    >
      <ol className="list-decimal space-y-5 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
        <li>
          <span className="font-semibold text-slate-900">
            Registration & Enrollment Fees
          </span>
          <p className="mt-1">
            All registration or admission fees are strictly non-refundable under
            any circumstances.
          </p>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Course Fee Refund Eligibility
          </span>
          <p className="mt-1">
            Refunds are applicable based on the timing of the cancellation
            request:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              <span className="font-semibold text-slate-900">100% Refund:</span>{" "}
              If cancellation is requested within 5-7 days of enrollment and
              before course commencement.
            </li>
            <li>
              <span className="font-semibold text-slate-900">50% Refund:</span>{" "}
              If cancellation is requested before the course start date but
              after the initial refund window.
            </li>
            <li>
              <span className="font-semibold text-slate-900">No Refund:</span>{" "}
              Once the course has started, or if the student has attended
              classes or accessed course materials.
            </li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Digital / Online Courses
          </span>
          <p className="mt-1">
            Fees for online, recorded, or LMS-based courses are non-refundable
            once access is granted.
          </p>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Batch Transfers / Rescheduling
          </span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              Students may request a batch transfer instead of a refund, subject
              to availability and approval.
            </li>
            <li>Requests must be made before the course start date.</li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">
            Cancellation by LA BIM Academy
          </span>
          <p className="mt-1">
            If a course is canceled or postponed by the academy due to
            unforeseen reasons:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Students will receive a 100% refund, or</li>
            <li>Option to transfer to another batch/course.</li>
          </ul>
        </li>

        <li>
          <span className="font-semibold text-slate-900">Refund Process</span>
          <p className="mt-1">
            Refund requests must be submitted via email or official
            communication channel with:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Enrollment details</li>
            <li>Payment proof</li>
            <li>Reason for cancellation</li>
          </ul>
          <p className="mt-2">
            Approved refunds will be processed within 10-15 working days via the
            original payment method.
          </p>
        </li>

        <li>
          <span className="font-semibold text-slate-900">Important Notes</span>
          <p className="mt-1">No refund will be provided for:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Partial course completion</li>
            <li>Missed sessions or personal reasons</li>
            <li>Discounted or special offer enrollments</li>
          </ul>
          <p className="mt-2">
            Any applicable processing charges may be deducted.
          </p>
        </li>
      </ol>

      <div className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
        <h2 className="text-lg font-bold text-slate-900">Need Help?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
          For refund-related queries, contact our support team. We are here to
          assist you with the best possible solution.
        </p>
      </div>
    </LegalPageShell>
  );
}