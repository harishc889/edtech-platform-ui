import type { Metadata } from "next";
import Image from "next/image";
import BackNavLink from "@/app/components/back-nav-link";

export const metadata: Metadata = {
  title: "About Us | LA Bim Academy",
  description:
    "LA BIM Academy empowers students and professionals with practical, job-oriented BIM training aligned to real industry projects.",
};

const offerings = [
  "Comprehensive BIM courses (Architecture, Structure, MEP)",
  "Training on industry-standard software like Revit, Navisworks, BIM 360/ACC, AutoCAD",
  "Real project-based learning approach",
  "Placement assistance and career guidance",
  "Flexible learning options (online & offline)",
];


const whyChooseUs = [
  {
    title: "Industry-Focused Training",
    description: "We don’t just teach theory—our courses are designed around real-world projects using tools like Revit, Navisworks, and BIM workflows followed in the construction industry.",
  },
  {
    title: "Expert Mentorship",
    description: "Learn directly from experienced BIM professionals who bring practical site and project knowledge into the classroom.",
  },
  {
    title: "Hands-On Project Experience",
    description: "Students work on live and practical projects, helping them build a strong portfolio and gain confidence for real job roles.",
  },
  {
    title: "Placement Support & Career Guidance",
    description: "We provide dedicated placement assistance, resume building, and interview preparation to help learners secure opportunities in top companies.",
  },
];

const whoWeAreHighlights = [
  "LA BIM Academy provides high-quality BIM training for the architecture, engineering, and construction (AEC) industry.",
  "We bridge the gap between academics and real-world projects through practical, job-oriented training aligned with industry standards.",
  "Our expert BIM faculty brings real project experience, ensuring practical learning and industry exposure.",
  "We provide complete BIM training—from tools to project execution—making students industry-ready.",
  "We focus on hands-on learning through live projects, case studies, and simulations.",
  "We transform careers with training, placement support, portfolio building, and interview preparation.",
];

const commitmentPoints = [
  {
    title: "Accuracy First",
    description:
      "Practical workflows are taught with project quality and modeling precision in mind.",
  },
  {
    title: "Timely Delivery",
    description:
      "Learners build execution habits that support deadline-driven project environments.",
  },
  {
    title: "Innovation",
    description:
      "Curriculum evolves with new technologies and modern BIM implementation needs.",
  },
  {
    title: "Career Focus",
    description:
      "Placement assistance and mentorship keep the training outcome-driven.",
  },
  {
    title: "Collaboration",
    description:
      "Students practice team coordination like real AEC professionals.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[17rem] overflow-hidden sm:min-h-[19rem] lg:min-h-[24rem]">
        <Image
          src="/images/about-hero-bg.webp"
          alt=""
          fill
          priority
          quality={72}
          className="object-cover object-[50%_center] sm:object-[45%_center]"
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-slate-950/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/46 to-slate-900/24 sm:from-slate-950/64 sm:via-slate-950/42 sm:to-slate-900/16"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/16 to-slate-950/36"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-950/34 via-transparent to-blue-950/40 mix-blend-multiply"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[17rem] max-w-7xl flex-col justify-center px-4 py-14 sm:min-h-[19rem] sm:px-6 sm:py-16 lg:min-h-[24rem] lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl text-center drop-shadow-md">
            {/* <p className="inline-flex rounded-full border border-cyan-200/30 bg-cyan-500/15 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-100 backdrop-blur-sm">
              LA BIM Academy
            </p> */}
            <h1 className="font-display mt-5 text-4xl font-bold uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_16px_rgb(0_0_0/0.45)] sm:text-5xl lg:text-6xl">
              About us
            </h1>
          </div>
        </div>
      </section>

      <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <section className="px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="mx-auto w-full max-w-6xl">
          <nav className="mb-8 text-sm">
            <BackNavLink className="font-semibold text-cyan-700 transition hover:text-cyan-600" />
          </nav>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
        <div className="mx-auto mt-2 grid w-full max-w-6xl gap-8 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm shadow-slate-200/50 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <p className="text-xl font-semibold text-slate-500">About LA BIM Academy</p>
            {/* <h1 className="font-display mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              About Us
            </h1> */}
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              LA BIM Academy is a leading training institute dedicated to shaping
              the future of the construction and design industry through advanced
              Building Information Modeling (BIM) education. We empower students,
              engineers, architects, and working professionals with
              industry-relevant skills that bridge the gap between academic
              learning and real-world project execution.
            </p>

            <h2 className="font-display mt-8 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Bridging the gap between academic learning and project execution
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              At LA BIM Academy, we bridge the gap between academic learning and real-world project execution by delivering practical, industry-focused BIM training.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
             Our programs are designed to transform theoretical knowledge into hands-on skills, ensuring learners are fully prepared for live construction and design projects.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
             Through real project exposure and expert guidance, we help students confidently transition from classroom learning to professional BIM careers.
            </p>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            <p className="mb-3 text-sm font-semibold text-slate-500">
              Why students choose us
            </p>
            <div className="space-y-3">
              {whyChooseUs.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <p className="text-sm font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="text-xl font-semibold text-slate-500">Who We Are</p>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Shaping the Future of BIM Professionals
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            LA BIM Academy is committed to empowering the next generation of AEC professionals through advanced BIM training. We focus on practical learning, industry standards, and career growth to help our learners succeed in a competitive market.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {whoWeAreHighlights.map((point) => (
              <article
                key={point}
                className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm shadow-slate-200/50"
              >
                <p className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-500" />
                  {point}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xl font-semibold text-slate-500">What We Offer</p>
          <h2 className="font-display mt-3 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            End-to-end BIM training designed to support every stage of your career
            growth
          </h2>
          {/* <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            We ensure every learner builds practical capability for real-world
            implementation, stronger coordination, and confident project outcomes.
          </p> */}

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {offerings.map((item, index) => (
              <article
                key={item}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-100/60"
                style={{ transitionDelay: `${index * 35}ms` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-50/0 via-cyan-50/0 to-cyan-100/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="relative flex items-start gap-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                  <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-500" />
                  <span>{item}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="border-y border-slate-200/80 bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-sm font-semibold text-slate-500">Our Commitment</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Excellence, precision, and learner success
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Our training commitment builds long-term confidence through trust,
            practical implementation, and proven industry readiness.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {commitmentPoints.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section> */}

      <section className="bg-gradient-to-br from-sky-950 via-cyan-950 to-slate-900 px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <div>
            <p className="text-xl font-semibold text-cyan-300">Mission & Vision</p>
            <h2 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-4xl">
            We believe in learning by doing.
            </h2>
            {/* <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              We believe in "learning by doing." Our training methodology focuses
              on practical implementation rather than just theory. Students work on
              live projects, collaborate like real industry teams, and develop
              problem-solving skills required in professional environments.
            </p> */}
          </div>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold text-white">Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Our mission is to provide practical, job-oriented BIM training that helps individuals build successful careers in architecture, engineering, and construction (AEC) industries. We focus on real-time project exposure, ensuring our students gain hands-on experience.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold text-white">Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
            We aim to become one of the most trusted BIM training institutes globally by continuously upgrading our curriculum, adopting the latest technologies, and maintaining strong industry connections.
            </p>
          </article>
        </div>
      </section>
      </main>
    </>
  );
}
