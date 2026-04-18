import Image from "next/image";
import Link from "next/link";
import FeaturedPrograms from "./components/featured-programs";
import HomeHeroActions from "./components/home-hero-actions";
import HomeFaqSection from "./components/home-faq-section";
import WhyLearnFromUs from "./components/why-learn-from-us";

export default function Home() {
  return (
    <>
      <section className="relative min-h-[28rem] overflow-hidden bg-slate-950 px-4 pb-20 pt-12 text-white sm:min-h-[32rem] sm:px-6 sm:pb-28 sm:pt-16 lg:min-h-[36rem] lg:px-8 lg:pb-32 lg:pt-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src="/images/hero-home.webp"
            alt="Professional learning: focused study with city and technology motifs"
            fill
            priority
            quality={72}
            className="object-cover object-[75%_center] sm:object-[70%_center] lg:object-[65%_center]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/88 to-slate-950/75 sm:bg-gradient-to-r sm:from-slate-950 sm:via-slate-950/90 sm:to-slate-950/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent sm:hidden" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
          aria-hidden
        >
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-200 backdrop-blur sm:text-sm">
            Live courses · Expert-led · Project-based
          </p> */}
          <h1 className="font-display mt-6 mb-24 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl xl:text-7xl">
          Master BIM with Expert{" "}
            <span className="bg-gradient-to-r from-sky-300 to-blue-200 bg-clip-text text-transparent">
            Led Courses
            </span>
          </h1>
          {/* <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg lg:text-xl">
            Explore featured courses below—open a dedicated course page for full
            details, or go to Enroll to pick your course and payment plan on
            its own page (same as the header Enroll button).
          </p> */}
          <HomeHeroActions />
        </div>
      </section>

      <FeaturedPrograms />

      <WhyLearnFromUs />

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-7xl min-h-[19rem] overflow-hidden rounded-3xl ring-1 ring-slate-200/80 sm:min-h-[22rem] lg:min-h-[26rem]">
          <Image
            src="/images/ready-to-enroll-bg.webp"
            alt=""
            fill
            quality={70}
            loading="lazy"
            className="object-cover object-[82%_center] sm:object-[78%_center] md:object-[72%_center] lg:object-[68%_center]"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/35 sm:via-slate-950/85 sm:to-slate-950/25"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-950/45 via-sky-950/20 to-blue-950/55 mix-blend-multiply"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/25 md:from-slate-950/50 md:to-slate-950/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
            aria-hidden
          >
            <div className="absolute -left-16 top-1/4 h-56 w-56 rounded-full bg-cyan-500/25 blur-3xl sm:h-72 sm:w-72" />
            <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
          </div>

          <div className="relative z-10 flex min-h-[19rem] flex-col justify-center px-6 py-12 text-center sm:min-h-[22rem] sm:px-10 sm:py-14 md:items-start md:text-left lg:min-h-[26rem] lg:px-14 lg:py-16">
            <div className="mx-auto w-full max-w-xl drop-shadow-md md:mx-0">
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Ready to enroll?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-200/95 sm:text-base md:mx-0">
                Browse the full catalog for live batches, or open the enrollment page
                to choose your program and payment plan.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
                <a
                  href="#courses"
                  className="inline-flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-900/30 transition hover:from-cyan-400 hover:to-blue-500 sm:w-auto sm:text-base"
                >
                  View all courses
                </a>
                <Link
                  href="/enroll"
                  className="inline-flex h-14 w-full items-center justify-center rounded-full border-2 border-white/35 bg-white/10 px-8 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto sm:text-base"
                >
                  Enroll now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeFaqSection />
    </>
  );
}
