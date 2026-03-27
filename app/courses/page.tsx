const courses = [
  {
    id: "fullstack",
    title: "Full-Stack Web Development",
    price: "$199",
    duration: "8 weeks",
  },
  {
    id: "analytics",
    title: "Data Analytics with Python",
    price: "$149",
    duration: "6 weeks",
  },
  {
    id: "ux",
    title: "UI/UX Design Essentials",
    price: "$129",
    duration: "5 weeks",
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="text-center sm:text-left">
          <p className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
            Live course catalog
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Courses
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-600 sm:max-w-2xl">
            Pick a course and learn with live sessions, practical exercises, and
            expert feedback.
          </p>
        </header>

        <section className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-zinc-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {course.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {course.duration}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600">
                  <div>
                    <span className="font-semibold text-zinc-900">
                      Price:{" "}
                    </span>
                    {course.price}
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900">
                      Duration:{" "}
                    </span>
                    {course.duration}
                  </div>
                </div>

                <div className="mt-6 flex flex-1 items-end">
                  <button
                    type="button"
                    className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

