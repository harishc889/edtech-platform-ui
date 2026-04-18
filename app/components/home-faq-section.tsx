import Link from "next/link";

/**
 * FAQ copy as HTML fragments (trusted static content only).
 * Use normal tags: p, ul, li, strong, a. Styling: `.home-faq-html` in `app/globals.css`.
 */
type FaqItem = {
  q: string;
  answerHtml: string;
};

const faqs: FaqItem[] = [
  {
    q: "What is BIM and why should I learn it?",
    answerHtml: `<p>Building Information Modeling (BIM) is a smart digital process used in construction and design to create and manage building data. Learning BIM opens up career opportunities in architecture, engineering, and construction industries.</p>
    `.trim(),
  },
  {
    q: "Who can join the courses?",
    answerHtml: `
    <p>Our courses are suitable for:</p>
    <ul>
      <li>Civil engineers</li>
      <li>Architects</li>
      <li>MEP engineers</li>
      <li>Diploma students</li>
      <li>Freshers and working professionals</li>
    </ul>
    <p>No prior BIM experience is required for beginner-level courses—eligibility for each track is listed on the course page.</p>
    `.trim(),
  },
  {
    q: "Which softwares will I learn ?",
    answerHtml: `
    <p>You will learn industry-standard tools such as:</p>
    <ul>
    <li>Revit (Architecture, Structure, MEP)</li>
    <li>Navisworks</li>
    <li>BIM AI related Add-in </li>
    <li>BIM 360 / ACC</li>
    <li>Other BIM-related tools used in real projects</li>
    </ul>
    `.trim(),
  },
  {
    q: "Do you provide practical training?",
    answerHtml: `<p>Yes, we focus heavily on hands-on practical learning. Students work on real-time projects and models to gain industry experience.</p>
    `.trim(),
  },
  {
    q: "Will I get a certificate after completing the course?",
    answerHtml: `<p>Yes, you will receive a course completion certificate from LA BIM Academy, which helps in job applications and career growth.</p>
    `.trim(),
  },
  {
    q: "Do you provide placement assistance?",
    answerHtml: `
<p>Yes, we offer career support, including:</p>
<ul>
<li>Resume building</li>
<li>Interview preparation</li>
<li>Job guidance and referrals</li>
</ul>
    `.trim(),
  },
  {
    q: "What is the course duration?",
    answerHtml: `<p>Course duration varies depending on the program. Typically, courses range from 1 month to 6 months.</p>
    `.trim(),
  },
  {
    q: "Are online classes available?",
    answerHtml: `<p>Yes, we offer online classes with flexible timings for students and working professionals.</p>`.trim(),
  },
  {
    q: "What makes LA BIM Academy different from others?",
    answerHtml: `
<ul>
<li>Industry-oriented training</li>
<li>Experienced trainers</li>
<li>Real project exposure</li>
<li>Affordable fees</li>
<li>Personalized support</li>
</ul>
    `.trim(),
  },
  {
    q: "Do I need a strong computer to learn BIM?",
    answerHtml: `
<p>A basic laptop/desktop can get you started, but for better performance, a system with good RAM and graphics support is recommended.</p>
`.trim(),
  },
  {
    q: "Can beginners learn BIM easily?",
    answerHtml: `
<p>Yes, our courses are designed to start from basics and gradually move to advanced concepts, making it easy for beginners.</p>
    `.trim(),
  },
  {
    q: "How can I enroll in a course?",
    answerHtml: `
<p>You can enroll by contacting us through:</p>
<ul>
<li>Phone / WhatsApp</li>
<li>Website registration form</li>
</ul>
    `.trim(),
  },
];

export default function HomeFaqSection() {
  return (
    <section
      className="border-t border-slate-200/90 bg-gradient-to-b from-white via-slate-50/40 to-sky-50/20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      aria-labelledby="home-faq-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-800/90">FAQs</p>
        <h2
          id="home-faq-heading"
          className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
        >
          Deconstructing{" "}
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">your doubts</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Straight answers to common questions—so you can move ahead with a clear picture of what learning here looks like.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl space-y-3 sm:mt-14 sm:space-y-4">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm ring-1 ring-slate-100/80 transition-[border-color,box-shadow,background-color] duration-200 open:border-slate-700/90 open:bg-gradient-to-br open:from-slate-700 open:via-slate-700 open:to-slate-600 open:shadow-xl open:ring-slate-800/60"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 text-left sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1 font-display text-base font-bold leading-snug text-slate-900 group-open:text-white sm:text-lg">
                {item.q}
              </span>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-slate-50 text-slate-600 transition duration-200 group-open:border-white/20 group-open:bg-white/10 group-open:text-white"
                aria-hidden
              >
                <svg
                  className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="border-t border-slate-100/90 px-4 pb-5 pt-0 group-open:border-white/10 sm:px-5 sm:pb-6">
              <div
                className="home-faq-html pt-4 text-[15px] sm:text-base"
                // eslint-disable-next-line react/no-danger -- trusted static FAQ markup from this file only
                dangerouslySetInnerHTML={{ __html: item.answerHtml }}
              />
            </div>
          </details>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-xl text-center text-sm text-slate-500">
        Still unsure?{" "}
        <Link href="/contact" className="font-semibold text-cyan-700 underline-offset-2 hover:text-cyan-800 hover:underline">
          Contact us
        </Link>{" "}
        and we’ll help you pick the right track.
      </p>
    </section>
  );
}
