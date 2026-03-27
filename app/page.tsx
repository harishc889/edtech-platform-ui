import Link from "next/link";

export default function Home() {
  const courses = [
    {
      title: "Full-Stack Web Development",
      description:
        "Build production-ready apps with modern frontend and backend tools.",
      level: "Intermediate",
    },
    {
      title: "Data Analytics with Python",
      description:
        "Learn data cleaning, visualization, and practical analytics workflows.",
      level: "Beginner",
    },
    {
      title: "UI/UX Design Essentials",
      description:
        "Design user-centered products with wireframes, prototypes, and testing.",
      level: "All Levels",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl">
        <div className="rounded-3xl bg-white/90 p-8 shadow-lg ring-1 ring-zinc-200 backdrop-blur sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
              Live courses led by industry experts
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Learn Skills That Matter
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg">
              Join interactive live classes and gain practical skills you can
              apply right away.
            </p>
            <Link
              href="/courses"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-base"
            >
              Explore Courses
            </Link>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Featured Courses
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
                className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {course.level}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {course.description}
                </p>
                <button
                  type="button"
                  className="mt-5 w-fit rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-indigo-400 hover:text-indigo-700"
                >
                  View details
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
