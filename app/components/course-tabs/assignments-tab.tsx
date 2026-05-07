"use client";

import { useState, type FormEvent } from "react";
import type { Program } from "@/lib/program-catalog";

type Props = {
  course: Program;
};

export default function AssignmentsTab({ course }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold text-white sm:text-xl">
        Project uploads
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-400">
        Submit industry-standard deliverables (for example Revit, Navisworks, or IFC
        packages). Keep file sizes reasonable; mentors review submissions during studio
        hours.
      </p>
      <div className="mt-8 space-y-6">
        {course.modules.map((module, idx) => (
          <AssignmentCard
            key={`${module.title}-${idx}`}
            courseTitle={course.title}
            moduleTitle={module.title}
            moduleIndex={idx + 1}
          />
        ))}
      </div>
    </div>
  );
}

function AssignmentCard({
  courseTitle,
  moduleTitle,
  moduleIndex,
}: {
  courseTitle: string;
  moduleTitle: string;
  moduleIndex: number;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    setFile(null);
    setNotes("");
    const input = document.getElementById(
      `assignment-file-${moduleIndex}`,
    ) as HTMLInputElement | null;
    if (input) input.value = "";
  }

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-wide text-cyan-400">
        Module {moduleIndex}
      </p>
      <h3 className="mt-1 font-semibold text-white">{moduleTitle}</h3>
      <p className="mt-2 text-xs text-slate-500">Course: {courseTitle}</p>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-xs font-bold uppercase tracking-wide text-slate-400"
            htmlFor={`assignment-file-${moduleIndex}`}
          >
            Upload project files
          </label>
          <input
            id={`assignment-file-${moduleIndex}`}
            type="file"
            className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
            onChange={(ev) => {
              setFile(ev.target.files?.[0] ?? null);
              setStatus("idle");
            }}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Accepted: .rvt, .nwd, .dwg, .ifc, .zip, PDFs, and supporting exports.
          </p>
        </div>
        <div>
          <label
            className="block text-xs font-bold uppercase tracking-wide text-slate-400"
            htmlFor={`assignment-notes-${moduleIndex}`}
          >
            Notes for mentor (optional)
          </label>
          <textarea
            id={`assignment-notes-${moduleIndex}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-600 focus:outline-none focus:ring-1 focus:ring-cyan-600"
            placeholder="software version, submission scope, team member names…"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500"
          >
            Submit deliverable
          </button>
          {status === "sent" ? (
            <span className="text-xs font-semibold text-emerald-400">
              Recorded locally — connect backend upload API when ready.
            </span>
          ) : null}
          {status === "error" ? (
            <span className="text-xs font-semibold text-rose-400">
              Choose at least one file to submit.
            </span>
          ) : null}
        </div>
      </form>
    </article>
  );
}
