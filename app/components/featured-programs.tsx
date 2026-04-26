"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { asRecordList } from "@/lib/api-normalize";
import { mapCourseToProgram } from "@/lib/course-program-adapter";
import { getPublishedCourses } from "@/lib/course-service";
import type { Program } from "@/lib/program-catalog";

export default function FeaturedPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    let active = true;
    void getPublishedCourses().then((res) => {
      if (!active || !res.ok) return;
      const rows = asRecordList(res.data);
      setPrograms(rows.map((row) => mapCourseToProgram(row)));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="courses"
      className="bg-mesh px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">
            Your global career starts here
          </p> */}
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Our courses
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            Our courses are structured with a practical approach, combining theoretical knowledge + live project training to ensure you gain hands-on experience.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {programs.map((program) => {
            const programHref = `/courses/${program.id}`;
            const enrollHref = `/enroll?course=${encodeURIComponent(program.id)}`;
            const coverSrc = program.cardCoverImage?.trim() ?? "";
            const hasCoverImage = coverSrc.length > 0;
            const coverStyle = hasCoverImage
              ? {
                  backgroundImage: `linear-gradient(to top, rgb(15 23 42 / 0.94) 0%, rgb(15 23 42 / 0.55) 20%, rgb(15 23 42 / 0.2) 40%), url(${JSON.stringify(encodeURI(coverSrc))})`,
                  backgroundSize: "cover" as const,
                  backgroundPosition: "center" as const,
                }
              : undefined;
            return (
              <article
                key={program.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/80 hover:shadow-xl hover:shadow-sky-500/10"
              >
                <div
                  className={
                    hasCoverImage
                      ? "relative h-44 overflow-hidden bg-slate-900 sm:h-52"
                      : "relative h-44 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-sky-900 sm:h-48"
                  }
                  style={coverStyle}
                >
                  {!hasCoverImage ? (
                  <div
                    className="absolute inset-0 opacity-40"
                    aria-hidden
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 80%, rgb(56 189 248 / 0.32), transparent 50%), radial-gradient(circle at 80% 20%, rgb(59 130 246 / 0.28), transparent 45%)",
                    }}
                  />
                  ) : null}
                  <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                    <h3
                      className={`font-display text-2xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-[1.65rem] lg:text-3xl ${
                        hasCoverImage
                          ? "drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)]"
                          : "drop-shadow-sm"
                      }`}
                    >
                      {program.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-slate-100/95 sm:text-base lg:text-[1.05rem]">
                      {program.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <dl className="overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/90 to-sky-50/40 shadow-sm ring-1 ring-slate-100/90">
                    <div className="flex gap-4 border-slate-200/70 px-4 py-4 sm:px-5 sm:py-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                        aria-hidden
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-800/80">
                          Duration
                        </dt>
                        <dd className="mt-0.5 text-base font-medium leading-snug tracking-tight text-slate-600 sm:text-lg">
                          {program.duration}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-4 px-4 py-4 sm:px-5 sm:py-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-slate-800 text-white shadow-md shadow-sky-600/20"
                        aria-hidden
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-800/80">
                          Eligibility
                        </dt>
                        <dd className="mt-0.5 text-base font-medium leading-snug tracking-tight text-slate-600 sm:text-lg">
                          {program.eligibility}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  {program.description ? (
                    <p className="mt-5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {program.description}
                    </p>
                  ) : null}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      href={programHref}
                      className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-sky-400 hover:text-sky-800"
                    >
                      View course
                    </Link>
                    <Link
                      href={enrollHref}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-500 hover:to-blue-500"
                    >
                      Enroll
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
