"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser, logout, type AuthUser } from "@/lib/auth-service";

const enrolledCourses = [
  {
    id: "fullstack",
    title: "Full-Stack Web Development",
    progress: 72,
    nextSession: "Tonight • 7:00 PM",
  },
  {
    id: "analytics",
    title: "Data Analytics with Python",
    progress: 45,
    nextSession: "Tomorrow • 6:00 PM",
  },
  {
    id: "ux",
    title: "UI/UX Design Essentials",
    progress: 88,
    nextSession: "Mon • 5:30 PM",
  },
];

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-zinc-200">
      <div
        className="h-2 rounded-full bg-indigo-600 transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        aria-hidden="true"
      />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMe() {
      const response = await fetchCurrentUser();
      if (!active) return;

      if (!response.ok) {
        router.push("/login");
        return;
      }

      setCurrentUser(response.data ?? null);
      setLoadingUser(false);
    }

    void loadMe();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      router.push("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-sm text-zinc-600">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
              Student dashboard
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Your enrolled courses
            </h1>
            <p className="mt-2 text-base leading-7 text-zinc-600">
              Track progress and jump into the next live class.
            </p>
            {currentUser?.email ? (
              <p className="mt-1 text-sm text-zinc-500">
                Signed in as {currentUser.email}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </header>

        <section className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <article
                key={course.id}
                className="flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-zinc-200 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {course.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {course.progress}%
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-zinc-600">
                    <span>Progress</span>
                    <span className="font-medium text-zinc-900">
                      {course.progress}% complete
                    </span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={course.progress} />
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200/60">
                  <p className="text-sm font-medium text-zinc-900">
                    Next live session
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {course.nextSession}
                  </p>
                </div>

                <div className="mt-6 flex flex-1 items-end">
                  <Link
                    href={`/courses?course=${encodeURIComponent(course.id)}`}
                    className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                  >
                    Join Live Class
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

