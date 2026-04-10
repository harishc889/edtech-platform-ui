import type { Metadata } from "next";
import { LegalPageShell } from "@/app/components/legal-page-shell";

const evaluationItems = [
  {
    title: "MCQ Test",
    details:
      "Daily test with 5 MCQs (10 marks). Passing marks: 5. Deadline: 24 hours from test start; no re-attempt after deadline.",
    weightage: "10%",
  },
  {
    title: "Assignments",
    details:
      "Module assignments with deadline-based scoring. On-time: 100%, within 1 week: 90%, 1–2 weeks: 75%, after 2 weeks: 50%.",
    weightage: "20%",
  },
  {
    title: "Attendance",
    details:
      "Attendance counted when learner attends more than 50% of class duration.",
    weightage: "10%",
  },
  {
    title: "Internship Project",
    details:
      "Real-world BIM project in each module. Evaluated on complexity, BIM standards, and quality. Same deadline penalty structure as assignments.",
    weightage: "25%",
  },
  {
    title: "Live Test",
    details:
      "Module-end live test (100 marks) during class timing, to be submitted within allotted time.",
    weightage: "25%",
  },
  {
    title: "Mock Interview & Portfolio",
    details:
      "Mock interview plus CV/portfolio review at course end to improve job readiness.",
    weightage: "10%",
  },
];

export const metadata: Metadata = {
  title: "Evaluation Criteria | LA Bim Solutions",
  description:
    "Admission requirements, evaluation criteria, and passing criteria for enrolled learners.",
};

export default function EvaluationCriteriaPage() {
  return (
    <LegalPageShell
      badge="Evaluation Criteria"
      title="Admission Requirements, Assessment & Certification Criteria"
      description="This page outlines the reference-style academic and performance criteria used for enrolled learners."
      maxWidth="5xl"
    >
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Admission Requirements
        </h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            Diploma or degree in Civil / Mechanical / Electrical / Architecture.
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            Prior professional experience (program-dependent; typically 3+ years
            for advanced tracks).
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            Basic computer literacy and strong engineering/architectural
            fundamentals.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Course Evaluation Criteria
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3">
          {evaluationItems.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
                <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-bold text-cyan-800">
                  Weightage: {item.weightage}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {item.details}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-900">
          Minimum Passing Criteria
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-cyan-900">
          <li>Score 50% or above overall to receive completion certificate.</li>
          <li>
            Below 50% receives participation certificate (subject to institute
            policy).
          </li>
          <li>
            Project submission, mock interview, and portfolio submission are
            required for completion status.
          </li>
        </ul>
      </section>
    </LegalPageShell>
  );
}
