"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Program } from "@/lib/program-catalog";

type Props = {
  course: Program;
  enrollHref: string;
  courseFeeInr: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toModuleDescriptionHtml(desc: string) {
  const trimmed = desc.trim();
  if (!trimmed) return "";

  // If author already provided HTML (ul/li/p), render as-is.
  if (/<(ul|ol|li|p|br)\b/i.test(trimmed)) {
    return trimmed;
  }

  const lines = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  const firstLine = escapeHtml(lines[0]);
  const isGoal = firstLine.toLowerCase().startsWith("goal:");
  const bullets = (isGoal ? lines.slice(1) : lines).map(escapeHtml);
  const goalHtml = isGoal
    ? `<p class="font-semibold text-slate-900">${firstLine}</p>`
    : "";
  const listItems = bullets.map((line) => `<li>${line}</li>`).join("");
  const listHtml = `<ul class="module-bullets">${listItems}</ul>`;

  return `${goalHtml}${listHtml}`;
}

export default function CourseDetailShowcase({
  course,
  enrollHref,
  courseFeeInr,
}: Props) {
  const [expandedModule, setExpandedModule] = useState<number>(0);
  const toolItems = useMemo(() => {
    if (course.tools && course.tools.length > 0) return course.tools;
    return Array.from({ length: 14 }).map((_, idx) => ({
      name: `Tool ${idx + 1}`,
      imagePath: "",
    }));
  }, [course.tools]);
  const certificationItems = useMemo(() => {
    if (course.certifications && course.certifications.length > 0) {
      return course.certifications;
    }
    return Array.from({ length: 14 }).map((_, idx) => ({
      title: `Certificate ${idx + 1}`,
      description: "Add your certificate details and description.",
      imagePath: "",
    }));
  }, [course.certifications]);
  const stats = useMemo(
    () => [
      { title: "Course Duration", value: `${course.duration} (${course.hours})` },
      { title: "Internship Duration", value: `${course.internshipDuration} (${course.internshipHours})` },
      { title: "Modules", value: `${course.modules.length}+` },
      { title: "Assessments", value: `${course.assessments}` },
      { title: "Language", value: course.language },
      { title: "Mode", value: course.mode },

    ],
    [course.duration, course.hours, course.internshipDuration, course.internshipHours, course.language, course.modules.length, course.careerRoles.length],
  );

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
      <section className="relative overflow-hidden px-6 py-12 text-white sm:px-10 sm:py-14">
        <div
          className="absolute inset-0 bg-cover bg-center"
          aria-hidden
          style={{
            backgroundImage: "url('/images/courses/course-hero-reference.png')",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(255 255 255 / 0.86) 0%, rgb(255 255 255 / 0.72) 44%, rgb(15 23 42 / 0.25) 100%)",
          }}
        />
        <div className="relative max-w-3xl">
          <div>
            <p className="inline-flex rounded-full border border-sky-700/20 bg-white/75 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-900">
              BIM Program
            </p>
            <h1 className="font-display mt-5 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            <p className="mt-3 text-lg font-semibold text-sky-900">{course.subtitle}</p>
            {/* <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-800 sm:text-base">
              {course.description ??
                "Build practical BIM expertise with live mentorship, structured studio modules, and career-aligned project training."}
            </p> */}
            <div className="mt-8 flex flex-wrap gap-3 sm:flex-nowrap">
              <Link
                href={enrollHref}
                className="h-8 inline-flex items-center justify-center rounded-full border border-slate-900/20 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-sky-50"
              >
                Request a callback
              </Link>
              <Link
                href="/#courses"
                className="h-8 inline-flex items-center justify-center rounded-full border border-slate-900/20 bg-white/70 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-white"
              >
                View all courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 border-t border-slate-100 px-6 py-10 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              {item.title}
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </section>

      {/* <section className="grid gap-8 border-t border-slate-100 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            Need Of The Hour
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold text-slate-900">
            BIM essential. Computational thinking future-ready.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            This course combines practical BIM implementation with modern digital workflows so
            you do not have to choose between foundations and advanced capability.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {course.highlights.map((point) => (
              <div
                key={point}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            Why Learners Choose This
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {course.engineeringBenefits.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-900">
            You are not just learning software. You are training for placement-ready BIM
            project delivery.
          </div>
        </div>
      </section> */}

      <section className="grid gap-8 border-t border-slate-100 px-6 py-10 sm:px-10 lg:grid-cols-[1.4fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            Course Modules
          </p>
          {/* <h2 className="font-display mt-3 text-3xl font-bold text-slate-900">
            Learn Through Structured Studio Sprints
          </h2> */}
          <div className="mt-6 grid gap-4">
            {course.modules.map((module, idx) => {
              return (
                <article
                  key={module.title}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${
                    expandedModule === idx
                      ? "border-sky-300 shadow-sky-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
                        Week {idx + 1}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-expanded={expandedModule === idx}
                      aria-controls={`module-panel-${idx}`}
                      onClick={() =>
                        setExpandedModule((current) => (current === idx ? -1 : idx))
                      }
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        expandedModule === idx
                          ? "bg-sky-100 text-sky-800"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span
                        className={`text-sm leading-none transition-transform ${
                          expandedModule === idx ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{module.title}</h3>
                  <div
                    id={`module-panel-${idx}`}
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedModule === idx
                        ? "mt-3 max-h-[28rem] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                  <div
                    className="text-sm leading-relaxed text-slate-700 [&_ul]:mt-2 [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:marker:text-sky-600"
                    dangerouslySetInnerHTML={{
                      __html: toModuleDescriptionHtml(module.desc),
                    }}
                  />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Learning Outcomes
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {course.learningOutcomes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Career Roles
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {course.careerRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-900"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-600 to-blue-600 p-6 text-white shadow-lg shadow-sky-200/70">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">
              Enrollment
            </p>
            <p className="mt-2 text-2xl font-extrabold">INR {courseFeeInr}</p>
            <p className="mt-2 text-sm text-sky-100">Seat booking starts from INR {new Intl.NumberFormat("en-IN").format(course.seatBookingInr)}.</p>
            <Link
              href={enrollHref}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-sky-50"
            >
              Enroll now
            </Link>
          </div> */}
        </aside>
      </section>

      <section className="border-t border-slate-100 px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-8">
          <h3 className="text-center text-lg font-bold text-white sm:text-2xl">
          Get Ready to BIM: Unlock 5 Powerful Software Tools to Elevate Your Career
          </h3>
          {/* <p className="mt-2 text-center text-xs text-slate-300 sm:text-sm">
            Replace each placeholder with your own tool icon/photo.
          </p> */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {toolItems.map((tool, idx) => (
              <div
                key={`tool-placeholder-${idx + 1}`}
                className="flex h-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white text-center shadow-sm sm:h-20"
              >
                {tool.imagePath ? (
                  <Image
                    src={tool.imagePath}
                    alt={tool.name}
                    width={140}
                    height={80}
                    className="h-full w-full object-contain p-2"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 180px"
                  />
                ) : (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                      {tool.name}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                      Add image path
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm sm:px-6 sm:py-8">
          <h3 className="text-center text-xl font-bold text-slate-900 sm:text-3xl">
            Certifications That Get You Placed!
          </h3>
          <div className="mt-6 mb-3">
            <div
              className={`grid gap-4 ${
                certificationItems.length <= 2
                  ? "mx-auto max-w-4xl md:grid-cols-2"
                  : "md:grid-cols-3"
              }`}
            >
              {certificationItems.map((certificate, idx) => (
                <article
                  key={`${certificate.title}-${idx}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
                >
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    {certificate.imagePath ? (
                      <Image
                        src={certificate.imagePath}
                        alt={certificate.title}
                        width={420}
                        height={220}
                        className="h-44 w-full object-contain bg-white p-2 blur-[.9px] sm:h-48 lg:h-52"
                        sizes="(max-width: 768px) 100vw, 30vw"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:h-44">
                        Add Certificate Image
                      </div>
                    )}
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-slate-900 sm:text-base">
                    {certificate.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {certificate.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <h2 className="text-center text-medium font-sm text-slate-600 sm:text-xl">
            Receive an industry-recognized certification along with an internship letter that validates both your technical skills and real-world project experience. This combination strengthens your professional profile, helping you stand out to employers and confidently secure job opportunities.
          </h2>
        </div>
      </section>

      {/* <section className="grid gap-4 border-t border-slate-100 px-6 py-10 sm:px-10 lg:grid-cols-2">
        <div className="rounded-3xl border border-sky-200 bg-sky-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            Evaluation Criteria
          </p>
          <h3 className="font-display mt-2 text-xl font-bold text-sky-950">
            Certification Requirements
          </h3>
          <p className="mt-2 text-sm text-sky-900">{course.criteriaSummary.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-sky-900">
              Total Credits: {course.criteriaSummary.totalCredits}
            </span>
            <span className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-sky-900">
              Minimum Score: {course.criteriaSummary.minimumScore}
            </span>
          </div>
          <Link
            href="/evaluation-criteria"
            className="mt-4 inline-flex text-sm font-bold text-sky-800 hover:text-sky-700"
          >
            Know more →
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Why This Program Is Different
          </p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              Real project style assignments instead of only demo exercises.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              Mentor-led feedback loops for portfolio and interview readiness.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              A complete route from skills training to placement support.
            </div>
          </div>
        </div>
      </section> */}

      <section className="border-t border-slate-100 px-6 py-10 sm:px-10">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 px-6 py-10 text-center text-white sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
            Final Step
          </p>
          <h2 className="font-display mt-3 text-3xl font-extrabold sm:text-4xl">
            Start Building Your BIM Career Path
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            Join the next intake, train with industry-aligned modules, and move toward
            job-ready BIM roles with structured support.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={enrollHref}
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-900 transition hover:bg-sky-50 sm:w-auto"
            >
              Apply / Enroll
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/20 sm:w-auto"
            >
              Talk to counselor
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
