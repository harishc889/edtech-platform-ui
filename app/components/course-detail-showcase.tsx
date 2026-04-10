"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Program } from "@/lib/program-catalog";

type Props = {
  course: Program;
  enrollHref: string;
  courseFeeInr: string;
  durationHours: string;
};

export default function CourseDetailShowcase({
  course,
  enrollHref,
  courseFeeInr,
  durationHours,
}: Props) {
  const overviewCards = useMemo(
    () => [
      { title: "Duration", value: `${course.duration}, ${durationHours}` },
      { title: "Language", value: course.language },
      { title: "No. of Modules", value: String(course.modules.length) },
    ],
    [course.duration, durationHours, course.language, course.modules.length],
  );
  const [activeOverview, setActiveOverview] = useState(1);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [activeBenefit, setActiveBenefit] = useState<number | null>(null);
  const [activeCareer, setActiveCareer] = useState<number | null>(null);
  const [overviewPaused, setOverviewPaused] = useState(false);
  const moduleRailRef = useRef<HTMLDivElement | null>(null);
  const benefitIcons = ["🤝", "⚙️", "✅", "🌍"];
  const careerIcons = ["🏗️", "📐", "🌉", "🧭", "🛠️", "📊"];

  useEffect(() => {
    if (overviewPaused) return;
    const timer = window.setInterval(() => {
      setActiveOverview((p) => (p + 1) % overviewCards.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [overviewCards.length, overviewPaused]);

  function prevCard() {
    setActiveOverview((p) => (p - 1 + overviewCards.length) % overviewCards.length);
  }
  function nextCard() {
    setActiveOverview((p) => (p + 1) % overviewCards.length);
  }
  function scrollModules(direction: "left" | "right") {
    const target = moduleRailRef.current;
    if (!target) return;
    const shift = direction === "left" ? -300 : 300;
    target.scrollBy({ left: shift, behavior: "smooth" });
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
      <section className="px-6 py-10 sm:px-10 sm:py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
          / Program Overview /
        </p>
        <h1 className="font-display mx-auto mt-3 max-w-4xl text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Specialize with {course.title}
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-center text-base leading-relaxed text-slate-600">
          {course.subtitle}
        </p>

        <div
          className="mt-8 flex items-center justify-center gap-2 sm:gap-6"
          onMouseEnter={() => setOverviewPaused(true)}
          onMouseLeave={() => setOverviewPaused(false)}
        >
          <button
            type="button"
            onClick={prevCard}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-200 text-sky-700 transition hover:bg-sky-50"
            aria-label="Previous overview card"
          >
            ←
          </button>

          <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
            {overviewCards.map((card, index) => {
              const active = index === activeOverview;
              return (
                <div
                  key={card.title}
                  className={`rounded-3xl border p-6 text-center transition ${
                    active
                      ? "border-sky-300 bg-gradient-to-br from-sky-600 to-blue-500 text-white shadow-lg shadow-sky-200"
                      : "border-slate-200 bg-slate-50/80 text-slate-800"
                  }`}
                >
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${active ? "text-sky-100" : "text-slate-500"}`}
                  >
                    {card.title}
                  </p>
                  <p className="mt-2 text-xl font-bold">{card.value}</p>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={nextCard}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-200 text-sky-700 transition hover:bg-sky-50"
            aria-label="Next overview card"
          >
            →
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          {overviewCards.map((card, idx) => (
            <button
              key={card.title}
              type="button"
              onClick={() => setActiveOverview(idx)}
              aria-label={`Go to ${card.title} card`}
              className={`h-2.5 rounded-full transition ${
                activeOverview === idx ? "w-7 bg-sky-600" : "w-2.5 bg-sky-200 hover:bg-sky-300"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-t border-slate-100 px-6 py-10 sm:px-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            / About BIM /
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold text-slate-900">
            BIM - A Revolution in the AEC Industry
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {course.description}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-8">
          <div
            className="absolute inset-0 opacity-45"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, rgb(56 189 248 / 0.35), transparent 40%), radial-gradient(circle at 20% 80%, rgb(59 130 246 / 0.3), transparent 45%)",
            }}
          />
          <div className="relative grid h-full place-items-center">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-sky-100 backdrop-blur">
              Intelligent BIM Visual Representation
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 px-6 py-10 sm:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
          / Civil Engineering /
        </p>
        <h2 className="font-display mt-3 text-center text-3xl font-bold text-slate-900">
          BIM in Civil Engineering
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {course.engineeringBenefits.map((item, idx) => (
            <div
              key={item}
              className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-white hover:shadow-lg hover:shadow-sky-100"
              onMouseEnter={() => setActiveBenefit(idx)}
              onMouseLeave={() =>
                setActiveBenefit((current) => (current === idx ? null : current))
              }
            >
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-sky-100 text-lg text-sky-700 transition group-hover:bg-sky-200">
                {benefitIcons[idx % benefitIcons.length]}
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{item}</p>
              <p
                className={`mt-2 text-xs leading-relaxed text-slate-600 transition-all duration-300 ${
                  activeBenefit === idx
                    ? "max-h-16 opacity-100"
                    : "max-h-0 overflow-hidden opacity-0 group-hover:max-h-16 group-hover:opacity-100"
                }`}
              >
                BIM enables stronger decision-making with measurable outcomes for this
                focus area.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-t border-slate-100 px-6 py-10 sm:px-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-8">
          <div
            className="absolute inset-0 opacity-45"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgb(56 189 248 / 0.35), transparent 40%), radial-gradient(circle at 80% 80%, rgb(59 130 246 / 0.28), transparent 45%)",
            }}
          />
          <div className="relative h-full rounded-2xl border border-white/15 bg-white/5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            / Course Highlights /
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold text-slate-900">
            Transform your career with expert BIM proficiency
          </h2>
          <ul className="mt-5 space-y-3 text-base text-slate-700">
            {course.highlights.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-600" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-100 px-6 py-10 sm:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
          / Course Modules /
        </p>
        <h2 className="font-display mt-3 text-center text-3xl font-bold text-slate-900">
          Unlocking Innovation and Methodologies with BIM
        </h2>
        <div className="mt-8 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollModules("left")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 text-sky-700 transition hover:bg-sky-50"
            aria-label="Scroll modules left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollModules("right")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 text-sky-700 transition hover:bg-sky-50"
            aria-label="Scroll modules right"
          >
            →
          </button>
        </div>
        <div
          ref={moduleRailRef}
          className="mt-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          <div className="grid w-max min-w-full auto-cols-[16rem] grid-flow-col gap-4 pr-4">
            {course.modules.map((m, idx) => (
              <article
                key={m.title}
                className="group relative snap-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100"
                onMouseEnter={() => setExpandedModule(idx)}
                onMouseLeave={() => setExpandedModule((current) => (current === idx ? null : current))}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-800">
                    Module {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{m.hours}</span>
                </div>
                <div
                  className="relative mt-3 h-24 rounded-xl border border-sky-100/70 bg-gradient-to-br from-slate-900 via-sky-900 to-blue-500 transition group-hover:brightness-110"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20% 20%, rgb(56 189 248 / 0.4), transparent 38%), radial-gradient(circle at 80% 85%, rgb(59 130 246 / 0.35), transparent 40%)`,
                  }}
                >
                  <span className="absolute left-2 top-2 rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                    Software {idx + 1}
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-full border border-white/35 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-sky-100">
                    BIM
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{m.title}</h3>

                <p
                  className={`mt-2 text-xs leading-relaxed text-slate-600 transition-all duration-300 ${
                    expandedModule === idx
                      ? "max-h-28 opacity-100"
                      : "max-h-0 overflow-hidden opacity-0 group-hover:max-h-28 group-hover:opacity-100"
                  }`}
                >
                  {m.desc}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedModule((current) => (current === idx ? null : idx))
                  }
                  className="mt-3 text-xs font-semibold text-sky-700 transition hover:text-sky-600"
                >
                  {expandedModule === idx ? "Read less" : "Read more"}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 border-t border-slate-100 px-6 py-10 sm:px-10 lg:grid-cols-2">
        <div className="rounded-3xl border border-sky-200 bg-sky-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            / Criteria /
          </p>
          <h3 className="font-display mt-2 text-xl font-bold text-sky-950">
            Evaluation Criteria
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
            Know More →
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            / Learn /
          </p>
          <h3 className="font-display mt-2 text-xl font-bold text-slate-900">
            What You Will Learn
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {course.learningOutcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 border-t border-slate-100 px-6 py-10 sm:px-10 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            / Career Prospects /
          </p>
          <h3 className="font-display mt-2 text-xl font-bold text-slate-900">
            Complete the course and lead the industry
          </h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {course.careerRoles.map((role, idx) => (
              <div
                key={role}
                className="group rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
                onMouseEnter={() => setActiveCareer(idx)}
                onMouseLeave={() => setActiveCareer(null)}
              >
                <p className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs">
                    {careerIcons[idx % careerIcons.length]}
                  </span>
                  <span>{role}</span>
                </p>
                <p
                  className={`text-xs text-slate-600 transition-all duration-300 ${
                    activeCareer === idx
                      ? "mt-1 max-h-14 opacity-100"
                      : "max-h-0 overflow-hidden opacity-0 group-hover:mt-1 group-hover:max-h-14 group-hover:opacity-100"
                  }`}
                >
                  Role-focused BIM responsibilities with project-ready workflow skills.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
            / Enrollment Process /
          </p>
          <h3 className="font-display mt-2 text-xl font-bold">Your Journey Starts Here</h3>
          <p className="mt-2 text-sm text-slate-200">
            Follow a simple enrollment process, choose payment mode, and begin your
            BIM pathway with structured onboarding.
          </p>
          <p className="mt-4 text-sm font-semibold text-sky-100">
            Course Fee: INR {courseFeeInr}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#courses"
              className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-white/35 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              All courses
            </Link>
            <Link
              href={enrollHref}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-sky-50"
            >
              Enroll now
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
