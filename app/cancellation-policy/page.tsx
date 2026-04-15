import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Cancellation Policy | LA Bim Academy",
  description: "Cancellation policy for LA Bim Academy courses and enrollments.",
};

export default function CancellationPolicyPage() {
  return (
    <LegalPageShell
      badge="Policy"
      title="Cancellation Policy - LA BIM Academy"
      description="Please review the cancellation and refund terms below before requesting any cancellation."
      maxWidth="5xl"
    >
      <ul className="space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
        <li>
          <span className="font-semibold text-slate-900">
            Cancellation Request:
          </span>{" "}
          All cancellation requests must be submitted in writing via email with
          course and enrollment details.
        </li>
        <li>
          <span className="font-semibold text-slate-900">
            Refund Eligibility:
          </span>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              Within 7 days of enrollment and before accessing significant
              course content - eligible for full refund.
            </li>
            <li>
              After 7 days or once training has started - no refund applicable.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-semibold text-slate-900">Batch Transfers:</span>{" "}
          Students may request to reschedule or transfer to another batch
          (subject to availability).
        </li>
        <li>
          <span className="font-semibold text-slate-900">Non-Attendance:</span>{" "}
          Failure to attend classes does not qualify for a refund.
        </li>
        <li>
          <span className="font-semibold text-slate-900">
            Institute Cancellation:
          </span>{" "}
          If LA BIM Academy cancels or reschedules a course, students will be
          offered a full refund or batch transfer option.
        </li>
        <li>
          <span className="font-semibold text-slate-900">Processing Time:</span>{" "}
          Approved refunds will be processed within 7-10 working days.
        </li>
      </ul>
    </LegalPageShell>
  );
}