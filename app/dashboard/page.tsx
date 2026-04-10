"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  enrollmentsFromMePayload,
  profileFromMePayload,
} from "@/lib/api-normalize";
import { fetchCurrentUser, type AuthUser } from "@/lib/auth-service";

function mapEnrollmentRow(raw: Record<string, unknown>, index: number) {
  const courseId = String(
    raw.courseId ?? raw.course_id ?? raw.id ?? `row-${index}`,
  );
  const id = String(
    raw.id ?? raw.enrollmentId ?? raw.batchId ?? courseId,
  );
  const title = String(
    raw.title ??
      raw.courseTitle ??
      raw.courseName ??
      raw.name ??
      "Course",
  );
  let progress = 0;
  if (typeof raw.progress === "number") {
    progress = Math.max(0, Math.min(100, Math.round(raw.progress)));
  } else if (typeof raw.progressPercent === "number") {
    progress = Math.max(0, Math.min(100, Math.round(raw.progressPercent)));
  }
  const nextSession =
    typeof raw.nextSession === "string"
      ? raw.nextSession
      : typeof raw.scheduledAt === "string"
        ? raw.scheduledAt
        : "—";
  return { id, courseId, title, progress, nextSession };
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
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
  const [enrolledCourses, setEnrolledCourses] = useState<
    ReturnType<typeof mapEnrollmentRow>[]
  >([]);
  useEffect(() => {
    let active = true;

    async function loadMe() {
      const response = await fetchCurrentUser();
      if (!active) return;

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const payload = response.data;
      const profile = profileFromMePayload(payload) as AuthUser | null;
      setCurrentUser(profile);
      const rows = enrollmentsFromMePayload(payload);
      setEnrolledCourses(rows.map(mapEnrollmentRow));
      setLoadingUser(false);
    }

    void loadMe();
    return () => {
      active = false;
    };
  }, [router]);

  if (loadingUser) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-6 h-12 w-3/4 max-w-md animate-pulse rounded-xl bg-slate-200" />
          <p className="mt-8 text-sm font-medium text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-slate-200/80 pb-10">
          <div>
            <p className="inline-flex rounded-full bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800">
              Student dashboard
            </p>
            <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Your enrolled courses
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              Track progress and jump into the next live class.
            </p>
            {currentUser?.email ? (
              <p className="mt-3 text-sm font-medium text-slate-500">
                Signed in as{" "}
                <span className="text-slate-800">{currentUser.email}</span>
              </p>
            ) : null}
          </div>
        </header>

        <section className="mt-12">
          {enrolledCourses.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-lg shadow-slate-200/40 sm:p-14">
              <p className="text-base text-slate-600">
                You are not enrolled in any courses yet.
              </p>
              <Link
                href="/courses"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500"
              >
                Browse courses
              </Link>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <article
                key={course.id}
                className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:border-cyan-200/80 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-lg font-bold text-slate-900 transition group-hover:text-cyan-800">
                    {course.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-xs font-bold text-white">
                    {course.progress}%
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="font-medium">Progress</span>
                    <span className="font-bold text-slate-900">
                      {course.progress}% complete
                    </span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={course.progress} />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Next live session
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {course.nextSession}
                  </p>
                </div>

                <div className="mt-8 flex flex-1 items-end">
                  <Link
                    href={`/courses?course=${encodeURIComponent(course.courseId)}`}
                    className="flex w-full items-center justify-center rounded-full bg-slate-900 py-3.5 text-center text-sm font-bold text-white transition hover:bg-slate-800"
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
