import type { Metadata } from "next";
import BackNavLink from "../components/back-nav-link";
import ContactForm from "../components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with LA BIM Academy for course guidance, batch schedules, and enrollment support.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
      <nav className="mb-8 text-sm">
            <BackNavLink className="font-semibold text-cyan-700 transition hover:text-cyan-600" />
      </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <section className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-lg shadow-slate-200/40 sm:p-9">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Send us a message
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Fill out the form and we will get back to you as soon as possible.
            </p>

            <ContactForm />
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-slate-950 p-7 text-slate-200 shadow-lg shadow-slate-900/30 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-white">
                Contact Details
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Reach out to us to learn more about our BIM courses in architecture, structure, and MEP. We’re happy to guide you on the right course and help you take the next step in your career.
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <p className="text-slate-400">Email</p>
                  <a
                    href="mailto:la@labimacademy.com"
                    className="mt-1 inline-block font-semibold text-white transition hover:text-cyan-300"
                  >
                    la@labimacademy.com
                  </a>
                </div>
                <div>
                  <p className="text-slate-400">Phone</p>
                  <a
                    href="tel:+917895001831"
                    className="mt-1 inline-block font-semibold text-white transition hover:text-cyan-300"
                  >
                    +91-7895001831
                  </a>
                </div>
                {/* <div>
                  <p className="text-slate-400">Location</p>
                  <p className="mt-1 font-semibold text-white">Vasant Kunj, India</p>
                </div> */}
              </div>
            </section>

            {/* <section className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm shadow-slate-200/50 sm:p-8">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Project details that help us respond faster
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Include information such as project type (landscape, building,
                infrastructure), location, stage (concept, design, construction),
                and any available drawings or models. This helps us suggest the
                right BIM services for you.
              </p>
            </section> */}
          </aside>
        </div>
      </div>
    </main>
  );
}