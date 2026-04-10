"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { asRecordList } from "@/lib/api-normalize";
import { getBatchesForCourse } from "@/lib/batch-service";
import { getCourseById, getPublishedCourses } from "@/lib/course-service";
import { enrollInBatch } from "@/lib/enroll-service";

function mapCourseCard(raw: Record<string, unknown>, index: number) {
  const id = String(raw.id ?? index);
  const title = String(raw.title ?? raw.name ?? "Untitled course");
  const price =
    raw.price != null && raw.price !== ""
      ? String(raw.price)
      : raw.priceUsd != null
        ? String(raw.priceUsd)
        : "—";
  const duration =
    typeof raw.duration === "string" && raw.duration
      ? raw.duration
      : typeof raw.durationWeeks === "number"
        ? `${raw.durationWeeks} weeks`
        : "—";
  return { id, title, price, duration };
}

export default function CoursesCatalog() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("course");

  const [courses, setCourses] = useState<ReturnType<typeof mapCourseCard>[]>(
    [],
  );
  const [listError, setListError] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(true);

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
            {courses.map((course) => (
              <article
                key={course.id}
                className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:border-cyan-200/80 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-xl font-bold text-slate-900 transition group-hover:text-cyan-800">
                    {course.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {course.duration}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800">Price</span>
                    <p className="mt-0.5 text-slate-600">{course.price}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Duration</span>
                    <p className="mt-0.5 text-slate-600">{course.duration}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-1 items-end">
                  <Link
                    href={`/courses?course=${encodeURIComponent(course.id)}`}
                    className="flex w-full items-center justify-center rounded-full bg-slate-900 py-3.5 text-center text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
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
