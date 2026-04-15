"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Pillar = {
  title: string;
  description: string;
  icon: ReactNode;
  /** Root-relative image under `public/`, e.g. `/images/why-learn/card-01.png` */
  coverImage?: string;
};

const pillars: Pillar[] = [
  {
    coverImage: "/images/why-learn/card-01.png",
    title: "Industry-Focused Training",
    description:
      "At LA Bim Academy, our courses are designed around real-world industry needs. You don’t just learn software - you learn how BIM is used on live construction and engineering projects.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    coverImage: "/images/why-learn/card-02.jpg",
    title: "Experienced Trainers",
    description:
      "Learn from professionals who have hands-on experience in BIM projects across multiple disciplines like Architecture, Structure, and MEP. This ensures practical insights, not just theoretical knowledge.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0115.09 0 1.049 1.049 0 011.04.671 1.049 1.049 0 01-.206 1.128L12 17.25l-8.184-6.304a1.049 1.049 0 01-.206-1.128 1.049 1.049 0 011.04-.671z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25v4.5M9 21h6" />
      </svg>
    ),
  },
  {
    coverImage: "/images/why-learn/card-03.jpg",
    title: "Job-Oriented Curriculum",
    description:
      "Our training programs are structured to make you job-ready. From basic concepts to advanced workflows, every module is aligned with current market demands.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.09 9.09 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    coverImage: "/images/why-learn/card-04.jpg",
    title: "Hands-On Practical Learning",
    description:
      "We believe in learning by doing. Students work on real-time projects, models, and case studies using tools like Revit, Navisworks, and other BIM software.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M6 3v12a3 3 0 003 3h6a3 3 0 003-3V3M9 9h6M9 15h6" />
      </svg>
    ),
  },
  {
    coverImage: "/images/why-learn/card-05.jpg",
    title: "Multi-Discipline BIM Exposure",
    description:
      "Get exposure to Architectural, Structural, and MEP modeling, coordination, and clash detection—making you a complete BIM professional.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-9 18.75h10.5a.75.75 0 00.75-.75V8.25a.75.75 0 00-.75-.75H3.75a.75.75 0 00-.75.75v10.5c0 .414.336.75.75.75z" />
      </svg>
    ),
  },
  {
    coverImage: "/images/why-learn/card-06.jpg",
    title: "Personalized Support",
    description:
      "We provide individual attention, doubt-clearing sessions, and mentorship to help every student progress confidently.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    coverImage: "/images/why-learn/card-07.jpg",
    title: "Certification & Career Support",
    description:
      "Receive industry-recognized certification upon course completion along with resume guidance, interview preparation, and placement assistance.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
        />
      </svg>
    ),
  },
  {
    coverImage: "/images/why-learn/card-08.jpg",
    title: "Strong Learning Community",
    description:
      "Join a network of learners and professionals where you can collaborate, share knowledge, and grow in your BIM career.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
  },
];

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

const navButtonClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-800 shadow-md shadow-slate-900/10 ring-1 ring-slate-100/90 backdrop-blur transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:pointer-events-none disabled:opacity-35 sm:h-12 sm:w-12";

export default function WhyLearnFromUs() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const nextProgress = max > 0 ? el.scrollLeft / max : 0;
    setScrollProgress(Number.isFinite(nextProgress) ? nextProgress : 0);
    setCanPrev(el.scrollLeft > 6);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scrollByViewport = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.max(240, Math.floor(el.clientWidth * 0.88)) * direction;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  return (
    <section
      className="relative overflow-hidden border-y border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-sky-50/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      aria-labelledby="why-learn-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgb(6 182 212 / 0.12), transparent 42%), radial-gradient(circle at 88% 10%, rgb(59 130 246 / 0.1), transparent 40%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-cyan-50/90 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-800">
            Why LA Bim Academy
          </p>
          <h2
            id="why-learn-heading"
            className="font-display mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Why learn{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              from us?
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Our goal is not just to teach software, but to build skilled professionals ready for the AEC industry.
          </p>
        </div>

        <div
          className="mt-10 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:mt-12"
          role="region"
          aria-roledescription="carousel"
          aria-label="Reasons to learn with LA Bim Academy"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              scrollByViewport(-1);
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              scrollByViewport(1);
            }
          }}
        >
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent sm:w-16"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-sky-50/80 via-white/70 to-transparent sm:w-16"
              aria-hidden
            />
            <button
              type="button"
              className={`${navButtonClass} absolute left-0 top-1/2 z-20 h-10 w-10 -translate-y-1/2 sm:h-12 sm:w-12`}
              aria-label="Show previous reasons"
              disabled={!canPrev}
              onClick={() => scrollByViewport(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className={`${navButtonClass} absolute right-0 top-1/2 z-20 h-10 w-10 -translate-y-1/2 sm:h-12 sm:w-12`}
              aria-label="Show next reasons"
              disabled={!canNext}
              onClick={() => scrollByViewport(1)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-11 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-14 [&::-webkit-scrollbar]:hidden"
              style={{ scrollPaddingInline: "0.25rem" }}
            >
              {pillars.map((item, i) => {
                const cover = item.coverImage?.trim() ?? "";
                const hasCover = cover.length > 0;
                return (
                  <article
                    key={item.title}
                    className="group relative isolate flex min-h-[19rem] snap-start flex-col overflow-hidden rounded-3xl border border-slate-900/10 bg-slate-900 shadow-lg shadow-slate-900/15 ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/10 sm:min-h-[22rem] md:min-h-[24rem] lg:min-h-[26rem] shrink-0 grow-0 basis-[min(100%,28rem)] sm:basis-[calc((100%-1.25rem)/1.82)] md:basis-[calc((100%-2.5rem)/2.75)] lg:basis-[calc((100%-6rem)/3.45)] max-w-[100%]"
                  >
                    {hasCover ? (
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw"
                        className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-sky-950"
                        aria-hidden
                      />
                    )}
                    {!hasCover ? (
                      <div
                        className="pointer-events-none absolute inset-0 opacity-50"
                        aria-hidden
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 20% 80%, rgb(56 189 248 / 0.22), transparent 50%), radial-gradient(circle at 80% 20%, rgb(59 130 246 / 0.2), transparent 45%)",
                        }}
                      />
                    ) : null}
                    <div
                      className={
                        hasCover
                          ? "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-slate-950/10"
                          : "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent"
                      }
                      aria-hidden
                    />
                    <span
                      className="pointer-events-none absolute right-3 top-3 font-display text-5xl font-black leading-none text-white/25 drop-shadow-sm transition group-hover:text-white/35 sm:right-4 sm:top-4 sm:text-6xl"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="relative z-10 mt-auto w-full p-4 sm:p-5">
                      <div
                        className={
                          hasCover
                            ? "rounded-2xl border border-white/25 bg-white/[0.14] p-4 shadow-[0_12px_48px_rgba(0,0,0,0.32)] ring-1 ring-white/15 backdrop-blur-xl supports-[backdrop-filter]:bg-white/[0.11] sm:p-5"
                            : "rounded-2xl border border-white/20 bg-slate-950/35 p-4 shadow-[0_12px_48px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/25 sm:p-5"
                        }
                      >
                        <div className="flex gap-3.5 sm:gap-4">
                          <div
                            className="hidden mt-0.5 shrink-0 rounded-xl border border-white/20 bg-white/15 p-2.5 text-white shadow-inner shadow-white/5 backdrop-blur-md sm:p-3"
                            aria-hidden
                          >
                            {item.icon}
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] sm:text-xl">
                              {item.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-white/92 sm:text-[0.9375rem]">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-md px-1">
            <div
              className="h-1.5 overflow-hidden rounded-full bg-slate-200/90"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(scrollProgress * 100)}
              aria-label="Carousel scroll position"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-[width] duration-150 ease-out"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            {/* <p className="mt-2 text-center text-xs text-slate-500">
              Swipe to explore. Arrow keys work when the carousel is focused.
            </p> */}
          </div>
        </div>
      </div>
    </section>
  );
}
