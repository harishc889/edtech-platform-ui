import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | LA Bim Academy",
  description:
    "Get in touch with LA Bim Academy for BIM and VDC services.",
};

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="mb-8 text-sm">
          <Link
            href="/"
            className="font-semibold text-cyan-700 transition hover:text-cyan-600"
          >
            ← Home
          </Link>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <section className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-lg shadow-slate-200/40 sm:p-9">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Send us a message
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Fill out the form and we will get back to you as soon as possible.
            </p>

            <form className="mt-8 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Name</span>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-500/30 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Email</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-500/30 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-500/30 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Subject</span>
                  <input
                    type="text"
                    placeholder="What is this regarding?"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-500/30 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Message</span>
                <textarea
                  rows={6}
                  placeholder="Describe your course, payment related queries..."
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-500/30 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2"
                />
              </label>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  className="inline-flex min-w-40 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500"
                >
                  Send Message
                </button>
                <p className="text-xs text-slate-500">
                  By submitting, you agree to be contacted about your enquiry.
                </p>
              </div>
            </form>
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
                    href="mailto:la@labimsolutions.com"
                    className="mt-1 inline-block font-semibold text-white transition hover:text-cyan-300"
                  >
                    la@labimacademy.com
                  </a>
                </div>
                <div>
                  <p className="text-slate-400">Phone</p>
                  <a
                    href="tel:+917017578290"
                    className="mt-1 inline-block font-semibold text-white transition hover:text-cyan-300"
                  >
                    +91-7017978290
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