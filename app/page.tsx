import Link from "next/link";
import FeaturedPrograms from "./components/featured-programs";
import HomeHeroActions from "./components/home-hero-actions";

export default function Home() {
  const stats = [
    { value: "10+", label: "Years of excellence" },
    { value: "11k+", label: "Learners worldwide" },
    { value: "45+", label: "Countries represented" },
    { value: "200+", label: "Hiring partners" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-mesh-dark px-4 pb-20 pt-12 text-white sm:px-6 sm:pb-28 sm:pt-16 lg:px-8 lg:pb-32 lg:pt-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        >
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-200 backdrop-blur sm:text-sm">
            Live courses · Expert-led · Project-based
          </p>
          <h1 className="font-display mt-6 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Your global career in tech{" "}
            <span className="bg-gradient-to-r from-sky-300 to-blue-200 bg-clip-text text-transparent">
              starts here
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl">
            Explore featured courses below—open a dedicated course page for full
            details, or go to Enroll to pick your course and payment plan on
            its own page (same as the header Enroll button).
          </p>
          <HomeHeroActions />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p className="font-display text-3xl font-bold text-sky-600 sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <FeaturedPrograms />

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 px-8 py-14 text-center sm:px-12 sm:py-16 lg:px-16">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Ready to enroll?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
            Browse the full catalog for live batches, or open the enrollment page
            to choose your program and payment plan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/courses"
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-sky-50 sm:w-auto sm:text-base"
            >
              View all courses
            </Link>
            <Link
              href="/enroll"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15 sm:w-auto sm:text-base"
            >
              Enroll now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
