"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CourseCard from "@/app/components/course-card";
import { asRecordList } from "@/lib/api-normalize";
import { getBatchesForCourse } from "@/lib/batch-service";
import { mapCourseToProgram } from "@/lib/course-program-adapter";
import { getCourseById, getPublishedCourses } from "@/lib/course-service";
import { enrollInBatch } from "@/lib/enroll-service";

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

function mapCourseCard(raw: Record<string, unknown>, index: number) {
  const id = String(raw.id ?? index);
  const program = mapCourseToProgram(raw, id);
  return {
    id,
    title: program.title,
    subtitle: program.subtitle,
    duration: program.duration,
    eligibility: program.eligibility,
    cardCoverImage: program.cardCoverImage,
    apiCourseId: program.apiCourseId,
  };
}

export default function CoursesCatalog() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("course");

  const [courses, setCourses] = useState<ReturnType<typeof mapCourseCard>[]>(
    [],
  );
  const [listError, setListError] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [nextBatchByCourseId, setNextBatchByCourseId] = useState<
    Record<string, NextBatchPreview>
  >({});

  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailRecord, setDetailRecord] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [batches, setBatches] = useState<Record<string, unknown>[]>([]);
  const [enrollMessage, setEnrollMessage] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setListLoading(true);
    setListError(null);
    void getPublishedCourses().then((res) => {
      if (!active) return;
      if (!res.ok) {
        setListError(res.message);
        setCourses([]);
        setListLoading(false);
        return;
      }
      const rows = asRecordList(res.data);
      setCourses(rows.map(mapCourseCard));
      setListLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (courses.length === 0) return;
    let active = true;
    void Promise.all(
      courses.map(async (course) => {
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
  }, [courses]);

  const loadDetail = useCallback(async (courseId: string) => {
    setDetailLoading(true);
    setDetailError(null);
    setDetailRecord(null);
    setBatches([]);
    setEnrollMessage(null);

    const [courseRes, batchRes] = await Promise.all([
      getCourseById(courseId),
      getBatchesForCourse(courseId),
    ]);

    if (!courseRes.ok) {
      setDetailError(courseRes.message);
      setDetailLoading(false);
      return;
    }

    const body = courseRes.data;
    setDetailRecord(
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : null,
    );

    if (batchRes.ok) {
      setBatches(asRecordList(batchRes.data));
    }

    setDetailLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDetailRecord(null);
      setBatches([]);
      setDetailError(null);
      setEnrollMessage(null);
      return;
    }
    void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  async function handleEnroll(batchId: number) {
    setEnrollMessage(null);
    setEnrollingId(String(batchId));
    const res = await enrollInBatch(batchId);
    setEnrollingId(null);
    if (!res.ok) {
      setEnrollMessage(res.message);
      return;
    }
    setEnrollMessage("Enrolled successfully.");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <header className="text-center sm:text-left">
          <p className="inline-flex items-center rounded-full bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800">
            Live course catalog
          </p>
          <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Courses
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:mx-0 sm:text-lg">
            Pick a course and learn with live sessions, practical exercises, and
            expert feedback.
          </p>
        </header>

        {listError ? (
          <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800">
            {listError}
          </p>
        ) : null}

        {listLoading ? (
          <div className="mt-12 flex items-center gap-3 text-sm font-medium text-slate-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
            Loading courses...
          </div>
        ) : null}

        <section className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const nextBatch = nextBatchByCourseId[course.id];
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
                />
              );
            })}
          </div>
        </section>

        {selectedId ? (
          <section className="mt-14 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Course details
            </h2>
            {detailLoading ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
                Loading...
              </p>
            ) : null}
            {detailError ? (
              <p className="mt-4 text-sm font-medium text-red-600">
                {detailError}
              </p>
            ) : null}
            {detailRecord && !detailLoading ? (
              <div className="mt-6 text-sm leading-relaxed text-slate-600">
                <p className="font-display text-lg font-bold text-slate-900">
                  {String(
                    detailRecord.title ?? detailRecord.name ?? "Course",
                  )}
                </p>
                {typeof detailRecord.description === "string" ? (
                  <p className="mt-3">{detailRecord.description}</p>
                ) : null}
              </div>
            ) : null}

            {batches.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Batches — enroll
                </h3>
                <ul className="mt-4 space-y-3">
                  {batches.map((b, i) => {
                    const bid = b.id ?? b.batchId;
                    const batchNum =
                      typeof bid === "number"
                        ? bid
                        : typeof bid === "string"
                          ? Number(bid)
                          : NaN;
                    const label =
                      typeof b.name === "string"
                        ? b.name
                        : typeof b.title === "string"
                          ? b.title
                          : `Batch ${String(bid ?? i)}`;
                    return (
                      <li
                        key={String(bid ?? i)}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3"
                      >
                        <span className="text-sm font-medium text-slate-800">
                          {label}
                        </span>
                        <button
                          type="button"
                          disabled={
                            !Number.isFinite(batchNum) ||
                            enrollingId === String(batchNum)
                          }
                          onClick={() => {
                            if (Number.isFinite(batchNum)) {
                              void handleEnroll(batchNum);
                            }
                          }}
                          className="rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md transition hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {enrollingId === String(batchNum)
                            ? "Enrolling..."
                            : "Enroll"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {enrollMessage ? (
              <p className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-900">
                {enrollMessage}
              </p>
            ) : null}

            <Link
              href="/courses"
              className="mt-8 inline-flex items-center text-sm font-bold text-cyan-700 transition hover:text-cyan-600"
            >
              ← Back to catalog
            </Link>
          </section>
        ) : null}
      </div>
    </main>
  );
}
