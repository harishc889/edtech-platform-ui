import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | LA Bim Academy",
  description:
    "Learn about LA Bim Academy—BIM training for architecture, structure, and MEP with a practical, industry-aligned approach.",
};

const focusAreas = [
  "Hands-on BIM modeling across architecture, structure, and MEP",
  "Live project–style briefs, assignments, and mentor feedback",
  "Documentation, coordination, and collaboration fundamentals",
  "Portfolio-oriented outcomes aligned with hiring expectations",
];

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[17rem] overflow-hidden sm:min-h-[19rem] lg:min-h-[24rem]">
        <Image
          src="/images/about-hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-[50%_center] sm:object-[45%_center]"
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-slate-950/30"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/58 via-slate-950/38 to-slate-900/12 sm:from-slate-950/50 sm:via-slate-950/32 sm:to-slate-900/8"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/48 via-slate-950/10 to-slate-950/28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-950/22 via-transparent to-blue-950/28 mix-blend-multiply"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
          aria-hidden
        >
          <div className="absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-cyan-500/14 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/12 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[17rem] max-w-7xl flex-col justify-center px-4 py-14 sm:min-h-[19rem] sm:px-6 sm:py-16 lg:min-h-[24rem] lg:px-8 lg:py-20">
          <div className="max-w-3xl text-center mx-auto drop-shadow-md">
            <h1 className="font-display text-4xl font-bold uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_16px_rgb(0_0_0/0.45)] sm:text-5xl lg:text-6xl">
              About us
            </h1>
          </div>
        </div>
      </section>

      <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-5xl">
          <nav className="mb-8 text-sm">
            <Link
              href="/"
              className="font-semibold text-cyan-700 transition hover:text-cyan-600"
            >
              ← Home
            </Link>
          </nav>

          <section className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-200/40 sm:p-10">
            <p className="inline-flex rounded-full bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800">
              Who we are
            </p>
            <h2 className="font-display mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              LA Bim Academy
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              LA BIM Academy is a professional training institute focused on delivering industry-relevant BIM education. We help students, engineers, architects, and working professionals develop practical skills that connect academic knowledge with real-world construction and design project requirements.
            </p>

            <div className="mt-10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                What we focus on
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {focusAreas.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
