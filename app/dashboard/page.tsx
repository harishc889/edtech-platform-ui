"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CourseCard from "@/app/components/course-card";
import {
  asRecordList,
  enrollmentsFromMePayload,
  profileFromMePayload,
} from "@/lib/api-normalize";
import { fetchCurrentUser, type AuthUser } from "@/lib/auth-service";
import { getBatchesForCourse } from "@/lib/batch-service";
import { mapCourseToProgram } from "@/lib/course-program-adapter";
import {
  getLearnCourseSlugForEnrollment,
  learnHrefForEnrollment,
} from "@/lib/learn-course-route";
import { getPublishedCourses } from "@/lib/course-service";
import { getMyEnrolledCourses } from "@/lib/enroll-service";
import {
  mapEnrollmentRow,
  normalizeEnrollmentKey as normalizeKey,
} from "@/lib/enrollment-map";
import {
  certificationsFromMePayload,
  mapCertificationRow,
} from "@/lib/me-certifications";

type EnrollmentChangedDetail = {
  courseId: string;
  courseCode?: string;
  courseTitle?: string;
  apiCourseId?: number;
};

type NextBatchPreview = {
  id: number;
  startDate: string;
  capacity: number;
};

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function formatBatchDate(value: string) {
  if (!value) return "TBA";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "TBA";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dt);
}

function pickNearestBatch(rows: Record<string, unknown>[]): NextBatchPreview | null {
  if (rows.length === 0) return null;
  const now = Date.now();
  const parsed = rows
    .map((row, idx) => {
      const id = toNumber(row.id ?? row.batchId, idx + 1);
      const startDateRaw =
        typeof row.startDate === "string" ? row.startDate : String(row.startDate ?? "");
      const timestamp = startDateRaw ? new Date(startDateRaw).getTime() : Number.NaN;
      const capacity = toNumber(row.capacity, 0);
      return { id, startDate: startDateRaw, timestamp, capacity };
    })
    .filter((item) => Number.isFinite(item.id));
  if (parsed.length === 0) return null;
  const upcoming = parsed
    .filter((item) => Number.isFinite(item.timestamp) && item.timestamp >= now)
    .sort((a, b) => a.timestamp - b.timestamp);
  const fallback = parsed
    .filter((item) => Number.isFinite(item.timestamp))
    .sort((a, b) => a.timestamp - b.timestamp);
  const best = upcoming[0] ?? fallback[0] ?? parsed[0];
  return { id: best.id, startDate: best.startDate, capacity: best.capacity };
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
  const [activeTab, setActiveTab] = useState<"courses" | "certifications" | "browse">("courses");
  const [enrolledCourses, setEnrolledCourses] = useState<
    ReturnType<typeof mapEnrollmentRow>[]
  >([]);
  const [certifications, setCertifications] = useState<
    ReturnType<typeof mapCertificationRow>[]
  >([]);
  const [browseCourses, setBrowseCourses] = useState<
    Array<ReturnType<typeof mapCourseToProgram>>
  >([]);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [nextBatchByCourseId, setNextBatchByCourseId] = useState<
    Record<string, NextBatchPreview>
  >({});
  const [optimisticEnrollmentHints, setOptimisticEnrollmentHints] = useState<
    EnrollmentChangedDetail[]
  >([]);
  const [refreshEnrollmentsTick, setRefreshEnrollmentsTick] = useState(0);
  const enrolledCourseKeys = new Set(
    enrolledCourses.flatMap((course) => {
      const normalizedCode = normalizeKey(course.courseCode);
      const normalizedTitle = normalizeKey(course.title);
      const normalizedCourseId = normalizeKey(course.courseId);
      return [
        course.courseId,
        String(Number(course.courseId)),
        normalizedCourseId,
        normalizedCode,
        normalizedTitle,
        Number.isFinite(course.apiCourseId) ? String(course.apiCourseId) : "",
      ];
    }),
  );
  useEffect(() => {
    function handleEnrollmentChanged(event: Event) {
      const customEvent = event as CustomEvent<EnrollmentChangedDetail | undefined>;
      const detail = customEvent.detail;
      if (detail && typeof detail.courseId === "string" && detail.courseId.trim()) {
        setOptimisticEnrollmentHints((prev) => {
          const next = prev.filter((item) => item.courseId !== detail.courseId);
          return [...next, detail];
        });
      }
      setRefreshEnrollmentsTick((v) => v + 1);
    }
    function handleVisibilityOrFocus() {
      setRefreshEnrollmentsTick((v) => v + 1);
    }
    window.addEventListener("enrollment:changed", handleEnrollmentChanged);
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    return () => {
      window.removeEventListener("enrollment:changed", handleEnrollmentChanged);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, []);
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
      const meRows = enrollmentsFromMePayload(payload);
      const fallbackResponse = await getMyEnrolledCourses();
      if (!active) return;
      const fallbackRows = fallbackResponse.ok
        ? asRecordList(fallbackResponse.data)
        : [];
      const mergedRows = [...meRows, ...fallbackRows];
      const mapped = mergedRows.map(mapEnrollmentRow);
      const seen = new Set<string>();
      const deduped = mapped.filter((course) => {
        const key = `${course.courseId}|${normalizeKey(course.courseCode)}|${normalizeKey(course.title)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const withOptimisticHints = [...deduped];
      optimisticEnrollmentHints.forEach((hint, idx) => {
        const hintCourseId = hint.courseId.trim();
        const hintKey = `${hintCourseId}|${normalizeKey(hint.courseCode ?? "")}|${normalizeKey(hint.courseTitle ?? "")}`;
        if (seen.has(hintKey)) return;
        seen.add(hintKey);
        withOptimisticHints.push({
          id: `local-${hintCourseId}-${idx}`,
          courseId: hintCourseId,
          apiCourseId:
            typeof hint.apiCourseId === "number" && Number.isFinite(hint.apiCourseId)
              ? hint.apiCourseId
              : Number.NaN,
          courseCode: hint.courseCode ?? "",
          title: hint.courseTitle ?? hintCourseId,
          progress: 0,
          nextSession: "—",
        });
      });
      setEnrolledCourses(withOptimisticHints);
      const certRows = certificationsFromMePayload(payload);
      setCertifications(certRows.map(mapCertificationRow));
      setLoadingUser(false);
    }

    void loadMe();
    return () => {
      active = false;
    };
  }, [optimisticEnrollmentHints, router, refreshEnrollmentsTick]);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBrowseLoading(true);
    void getPublishedCourses().then((res) => {
      if (!active) return;
      if (!res.ok) {
        setBrowseCourses([]);
        setBrowseLoading(false);
        return;
      }
      const rows = asRecordList(res.data);
      setBrowseCourses(rows.map((row) => mapCourseToProgram(row)));
      setBrowseLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (browseCourses.length === 0) return;
    let active = true;
    void Promise.all(
      browseCourses.map(async (course) => {
        if (!course.apiCourseId) return { courseId: course.id, nextBatch: null };
        const res = await getBatchesForCourse(course.apiCourseId);
        if (!res.ok) return { courseId: course.id, nextBatch: null };
        return {
          courseId: course.id,
          nextBatch: pickNearestBatch(asRecordList(res.data)),
        };
      }),
    ).then((results) => {
      if (!active) return;
      const mapped: Record<string, NextBatchPreview> = {};
      results.forEach((entry) => {
        if (entry.nextBatch) mapped[entry.courseId] = entry.nextBatch;
      });
      setNextBatchByCourseId(mapped);
    });
    return () => {
      active = false;
    };
  }, [browseCourses]);

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
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("courses")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeTab === "courses"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              Enrolled Courses ({enrolledCourses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("certifications")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeTab === "certifications"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              Certifications ({certifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("browse")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeTab === "browse"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              Browse Courses ({browseCourses.length})
            </button>
          </div>

          {activeTab === "courses" && enrolledCourses.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-lg shadow-slate-200/40 sm:p-14">
              <p className="text-base text-slate-600">
                You are not enrolled in any courses yet.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("browse")}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500"
              >
                Browse courses
              </button>
            </div>
          ) : null}

          {activeTab === "certifications" && certifications.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-lg shadow-slate-200/40 sm:p-14">
              <p className="text-base text-slate-600">
                Your certifications will appear here once issued.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("browse")}
                className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-300"
              >
                Continue learning
              </button>
            </div>
          ) : null}

          {activeTab === "courses" ? (
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

                  <div className="mt-8 flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
                    <Link
                      href={learnHrefForEnrollment(course, browseCourses)}
                      className="flex w-full flex-1 items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500"
                    >
                      Open course
                    </Link>
                    <Link
                      href={`/courses?course=${encodeURIComponent(getLearnCourseSlugForEnrollment(course, browseCourses))}`}
                      className="flex w-full flex-1 items-center justify-center rounded-full border-2 border-slate-200 bg-white py-3.5 text-center text-sm font-bold text-slate-800 transition hover:border-slate-300"
                    >
                      Course info &amp; live class
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {activeTab === "certifications" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((certificate) => (
                <article
                  key={certificate.id}
                  className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-md transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/80 hover:shadow-xl hover:shadow-cyan-500/10"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">
                    Certification
                  </p>
                  <h2 className="font-display mt-2 text-lg font-bold text-slate-900">
                    {certificate.title}
                  </h2>
                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold text-slate-900">Issued on:</span>{" "}
                      {certificate.issuedOn}
                    </p>
                    {certificate.credentialId ? (
                      <p className="mt-1">
                        <span className="font-semibold text-slate-900">Credential ID:</span>{" "}
                        {certificate.credentialId}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-6 flex flex-1 items-end">
                    {certificate.verifyUrl ? (
                      <Link
                        href={certificate.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-500 hover:to-blue-500"
                      >
                        Verify certificate
                      </Link>
                    ) : (
                      <span className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-500">
                        Verification link pending
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {activeTab === "browse" ? (
            browseLoading ? (
              <p className="text-sm text-slate-500">Loading available courses...</p>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {browseCourses.map((course) => {
                  const nextBatch = nextBatchByCourseId[course.id];
                  const isEnrolled =
                    enrolledCourseKeys.has(course.id) ||
                    enrolledCourseKeys.has(normalizeKey(course.id)) ||
                    enrolledCourseKeys.has(normalizeKey(course.title)) ||
                    enrolledCourseKeys.has(normalizeKey(course.id.replace(/-/g, " "))) ||
                    (course.apiCourseId > 0 && enrolledCourseKeys.has(String(course.apiCourseId)));
                  return (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      subtitle={course.subtitle}
                      duration={course.duration}
                      eligibility={course.eligibility}
                      nextBatchLabel={
                        nextBatch
                          ? `${formatBatchDate(nextBatch.startDate)} · ${nextBatch.capacity > 0 ? `${nextBatch.capacity} seats` : "Seats TBA"}`
                          : "Announcing soon"
                      }
                      cardCoverImage={course.cardCoverImage}
                      programHref={`/courses/${encodeURIComponent(course.id)}`}
                      enrollHref={`/enroll?course=${encodeURIComponent(course.id)}${nextBatch ? `&batch=${encodeURIComponent(String(nextBatch.id))}` : ""}`}
                      isEnrolled={isEnrolled}
                    />
                  );
                })}
              </div>
            )
          ) : null}
        </section>
      </div>
    </main>
  );
}
