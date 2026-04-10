import Link from "next/link";
import { PROGRAM_CATALOG } from "@/lib/program-catalog";

export default function FeaturedPrograms() {
  return (
    <section
      id="courses"
      className="bg-mesh px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">
            Your global career starts here
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Featured courses
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Each course has its own page with full details. Enroll opens the
            application page where you choose
            course and payment plan.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {PROGRAM_CATALOG.map((program) => {
            const programHref = `/courses/${program.id}`;
            const enrollHref = `/enroll?course=${encodeURIComponent(program.id)}`;
            return (
              <article
                key={program.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/80 hover:shadow-xl hover:shadow-sky-500/10"
              >
                <div className="relative h-40 bg-gradient-to-br from-slate-800 via-slate-900 to-sky-900 sm:h-44">
                  <div
                    className="absolute inset-0 opacity-40"
                    aria-hidden
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 80%, rgb(56 189 248 / 0.32), transparent 50%), radial-gradient(circle at 80% 20%, rgb(59 130 246 / 0.28), transparent 45%)",
                    }}
                  />
                  <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                    <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-100 backdrop-blur">
                      {program.level}
                    </span>
                    <h3 className="font-display mt-3 text-xl font-extrabold text-white sm:text-2xl">
                      {program.title}
                    </h3>
                    <p className="mt-1 max-w-xl text-sm font-medium text-slate-200 sm:text-base">
                      {program.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Duration
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">
                        {program.duration}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Eligibility
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">
                        {program.eligibility}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {program.description}
                  </p>

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
