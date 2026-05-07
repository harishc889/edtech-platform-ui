"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState, type FormEvent } from "react";
import { toModuleDescriptionHtml } from "@/lib/module-description-html";
import type {
  CourseLesson,
  CourseModule,
  CourseResourceLink,
  Program,
} from "@/lib/program-catalog";

export type PlayerCertification = {
  id: string;
  title: string;
  issuedOn: string;
  credentialId: string | null;
  verifyUrl: string | null;
};

type LearnTab =
  | "catalog"
  | "curriculum"
  | "assignments"
  | "certificates"
  | "career";

type Props = {
  course: Program;
  progressPercent: number;
  certifications: PlayerCertification[];
};

const AssignmentsTab = dynamic(
  () => import("@/app/components/course-tabs/assignments-tab"),
  {
    loading: () => <p className="text-sm text-slate-400">Loading assignments...</p>,
  },
);
const CertificatesTab = dynamic(
  () => import("@/app/components/course-tabs/certificates-tab"),
  {
    loading: () => <p className="text-sm text-slate-400">Loading certificates...</p>,
  },
);
const CareerTab = dynamic(
  () => import("@/app/components/course-tabs/career-tab"),
  {
    loading: () => <p className="text-sm text-slate-400">Loading career details...</p>,
  },
);

function youtubeEmbedId(url: string): string | null {
  try {
    const u = new URL(url, "https://www.youtube.com");
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
      const shortIdx = parts.indexOf("shorts");
      if (shortIdx >= 0 && parts[shortIdx + 1]) return parts[shortIdx + 1];
    }
  } catch {
    return null;
  }
  return null;
}

function VideoPane({ url }: { url: string }) {
  const yt = youtubeEmbedId(url);
  if (yt) {
    return (
      <div className="overflow-hidden rounded-xl bg-black shadow-lg ring-1 ring-slate-200/60">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="Lesson video"
        />
      </div>
    );
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return (
      <div className="overflow-hidden rounded-xl bg-black shadow-lg ring-1 ring-slate-200/60">
        <video className="aspect-video w-full bg-black" controls preload="metadata">
          <source src={url} />
          Your browser does not support embedded video.
        </video>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-sm font-semibold text-slate-800">External video</p>
      <p className="mt-2 text-xs text-slate-600">
        Open this link in a new tab to watch the lecture.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
      >
        Open video
      </a>
    </div>
  );
}

function resourceBadge(kind: CourseResourceLink["kind"]) {
  const labels: Record<CourseResourceLink["kind"], string> = {
    pdf: "PDF",
    zip: "Archive",
    model: "Model",
    link: "Link",
    other: "File",
  };
  return labels[kind] ?? "File";
}

function mergedResources(
  module: CourseModule,
  lesson: CourseLesson,
): CourseResourceLink[] {
  const map = new Map<string, CourseResourceLink>();
  for (const r of lesson.resources ?? []) map.set(r.url, r);
  for (const r of module.resources ?? []) {
    if (!map.has(r.url)) map.set(r.url, r);
  }
  return [...map.values()];
}

function flattenCurriculum(course: Program): Array<{
  key: string;
  module: CourseModule;
  lesson: CourseLesson;
}> {
  const rows: Array<{ key: string; module: CourseModule; lesson: CourseLesson }> =
    [];
  course.modules.forEach((mod, mi) => {
    const lessons: CourseLesson[] =
      mod.lessons && mod.lessons.length > 0
        ? mod.lessons
        : [
            {
              id: `${mi}-overview`,
              title: "Overview & reading",
              resources: mod.resources,
            },
          ];
    lessons.forEach((lesson, li) => {
      rows.push({
        key: `${mi}-${lesson.id}-${li}`,
        module: mod,
        lesson,
      });
    });
  });
  return rows;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-700/40">
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        aria-hidden
      />
    </div>
  );
}

export default function EnrolledCoursePlayer({
  course,
  progressPercent,
  certifications,
}: Props) {
  const [tab, setTab] = useState<LearnTab>("curriculum");
  const curriculum = useMemo(() => flattenCurriculum(course), [course]);
  const [activeKey, setActiveKey] = useState(() => curriculum[0]?.key ?? "");

  const displayKey = useMemo(() => {
    if (curriculum.length === 0) return "";
    if (curriculum.some((r) => r.key === activeKey)) return activeKey;
    return curriculum[0].key;
  }, [curriculum, activeKey]);

  const activeRow =
    curriculum.find((r) => r.key === displayKey) ?? curriculum[0] ?? null;

  const tabs: { id: LearnTab; label: string }[] = [
    { id: "catalog", label: "Course outline" },
    { id: "curriculum", label: "Curriculum" },
    { id: "assignments", label: "Assignments" },
    { id: "certificates", label: "Certificates" },
    { id: "career", label: "Career & placement" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="min-w-0 flex-1">
            <Link
              href="/dashboard"
              className="text-xs font-semibold uppercase tracking-wide text-cyan-400 hover:text-cyan-300"
            >
              ← Dashboard
            </Link>
            <h1 className="font-display mt-2 truncate text-xl font-extrabold text-white sm:text-2xl">
              {course.title}
            </h1>
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">{course.subtitle}</p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Your progress
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">{progressPercent}%</span>
              <ProgressBar value={progressPercent} />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <nav
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Course sections"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  tab === t.id
                    ? "bg-white text-slate-900 shadow-lg"
                    : "border border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {tab === "catalog" ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl sm:p-8">
            <h2 className="font-display text-lg font-bold text-white sm:text-xl">
              Modules &amp; theory
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Expand each module to review learning goals and curriculum notes—the same
              structure mentors use for live classes.
            </p>
            <div className="mt-8 space-y-4">
              {course.modules.map((module, idx) => (
                <details
                  key={`${module.title}-${idx}`}
                  className="group rounded-2xl border border-slate-800 bg-slate-950/80 open:border-cyan-900/50 open:bg-slate-900/60"
                  open={idx === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden [&::-webkit-details-marker]:hidden">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-cyan-400">
                        Module {idx + 1} · {module.hours}
                      </p>
                      <p className="mt-1 font-semibold text-white">{module.title}</p>
                    </div>
                    <span className="text-slate-500 transition group-open:rotate-180">▼</span>
                  </summary>
                  <div
                    className="module-bullets border-t border-slate-800 px-5 py-4 text-sm leading-relaxed text-slate-300 [&_li]:mt-1 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{
                      __html: toModuleDescriptionHtml(module.desc) || "<p>Details coming soon.</p>",
                    }}
                  />
                </details>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "curriculum" ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <aside className="lg:sticky lg:top-24 lg:w-80 lg:shrink-0">
              <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-inner">
                <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Lectures &amp; materials
                </p>
                <ul className="space-y-1">
                  {curriculum.map((row, idx) => {
                    const active = row.key === displayKey;
                    return (
                      <li key={row.key}>
                        <button
                          type="button"
                          onClick={() => setActiveKey(row.key)}
                          className={`flex w-full flex-col rounded-xl px-3 py-2.5 text-left text-sm transition ${
                            active
                              ? "bg-white font-bold text-slate-900"
                              : "text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {row.module.title}
                          </span>
                          <span className="mt-0.5">
                            {idx + 1}. {row.lesson.title}
                          </span>
                          {row.lesson.durationLabel ? (
                            <span className="mt-1 text-[11px] text-slate-500">
                              {row.lesson.durationLabel}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            <div className="min-w-0 flex-1 space-y-6">
              {activeRow ? (
                <>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-cyan-400">
                      {activeRow.module.title}
                    </p>
                    <h2 className="font-display mt-1 text-2xl font-bold text-white">
                      {activeRow.lesson.title}
                    </h2>
                  </div>

                  {activeRow.lesson.videoUrl ? (
                    <VideoPane url={activeRow.lesson.videoUrl} />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center">
                      <p className="text-base font-semibold text-white">
                        Video lecture coming soon
                      </p>
                      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                        Your academy will publish recordings here. Until then, use{" "}
                        <strong className="text-slate-300">Course outline</strong> for theory
                        notes and download materials below.
                      </p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                      Downloadable resources
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      PDFs, templates, sample models, and class files for this lesson.
                    </p>
                    <ul className="mt-4 space-y-2">
                      {mergedResources(activeRow.module, activeRow.lesson).length === 0 ? (
                        <li className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-500">
                          No files linked yet for this lesson.
                        </li>
                      ) : (
                        mergedResources(activeRow.module, activeRow.lesson).map((res) => (
                          <li key={res.url}>
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-800 hover:bg-slate-900"
                            >
                              <span className="min-w-0 truncate">{res.title}</span>
                              <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan-300">
                                {resourceBadge(res.kind)}
                              </span>
                            </a>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-slate-400">No curriculum items for this course.</p>
              )}
            </div>
          </div>
        ) : null}

        {tab === "assignments" ? <AssignmentsTab course={course} /> : null}

        {tab === "certificates" ? (
          <CertificatesTab certifications={certifications} />
        ) : null}

        {tab === "career" ? <CareerTab course={course} /> : null}
      </div>
    </div>
  );
}
