"use client";

import type { Program } from "@/lib/program-catalog";

type Props = {
  course: Program;
};

export default function CareerTab({ course }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-white">Career tracks</h2>
        <p className="mt-2 text-sm text-slate-400">
          Roles this program prepares you for—align assignments and portfolio pieces to
          these outcomes.
        </p>
        <ul className="mt-6 space-y-2">
          {course.careerRoles.length === 0 ? (
            <li className="text-sm text-slate-500">Career paths will be listed soon.</li>
          ) : (
            course.careerRoles.map((role) => (
              <li
                key={role}
                className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200"
              >
                {role}
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-white">
          Placement assistance
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Work with mentors on resume reviews, mock interviews, and portfolio critique.
          Complete assignments on time to stay eligible for recruiter referrals and
          internship verification letters.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Studio feedback on BIM standards and coordination workflows
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Guided capstone presentation suitable for employers
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Evaluation aligned with {course.criteriaSummary.minimumScore} minimum score
            criteria
          </li>
        </ul>
      </div>
    </div>
  );
}
