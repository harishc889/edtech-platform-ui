"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CourseCard from "@/app/components/course-card";
import type {
  CourseBatchDto,
  CourseByCodeDto,
} from "@/lib/course-api-types";
import { getCachedPrograms } from "@/lib/client-course-cache";
import { getCourseById } from "@/lib/course-service";
import { enrollInBatch } from "@/lib/enroll-service";
import { formatBatchDateCompact } from "@/lib/display-format";
import type { Program, ProgramNextBatch } from "@/lib/program-catalog";
import { trimOrEmpty, trimOrUndefined } from "@/lib/string-trim";

function mapCourseCard(program: Program, index: number) {
  const id = String(program.id ?? index);
  return {
    id,
    courseCode: program.id,
    title: program.title,
    subtitle: program.subtitle,
    duration: program.duration,
    eligibility: program.eligibility,
    cardCoverImage: program.cardCoverImage,
    apiCourseId: program.apiCourseId,
    nextBatch: program.nextBatch,
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

  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailCourse, setDetailCourse] = useState<CourseByCodeDto | null>(
    null,
  );
  const [batches, setBatches] = useState<CourseBatchDto[]>([]);
  const [enrollMessage, setEnrollMessage] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setListLoading(true);
    setListError(null);
    void getCachedPrograms()
      .then((programs) => {
        if (!active) return;
        if (programs.length === 0) {
          setListError("Unable to load courses right now. Please try again.");
          setCourses([]);
          return;
        }
        setCourses(programs.map((program, idx) => mapCourseCard(program, idx)));
      })
      .catch(() => {
        if (!active) return;
        setListError("Unable to load courses right now. Please try again.");
        setCourses([]);
      })
      .finally(() => {
        if (!active) return;
        setListLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const loadDetail = useCallback(async (courseCode: string) => {
    setDetailLoading(true);
    setDetailError(null);
    setDetailCourse(null);
    setBatches([]);
    setEnrollMessage(null);

    const courseRes = await getCourseById(courseCode);

    if (!courseRes.ok) {
      setDetailError(courseRes.message);
      setDetailLoading(false);
      return;
    }

    const body = courseRes.data;
    if (!body) {
      setDetailError("Course details are unavailable.");
      setDetailLoading(false);
      return;
    }
    setDetailCourse(body);
    setBatches(body.batches ?? []);

    setDetailLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDetailCourse(null);
      setBatches([]);
      setDetailError(null);
      setEnrollMessage(null);
      return;
    }
    if (courses.length === 0) return;
    const selectedCourse =
      courses.find((course) => course.id === selectedId) ??
      courses.find((course) => String(course.apiCourseId) === selectedId) ??
      null;
    const courseCode = selectedCourse?.courseCode ?? selectedId;
    if (!selectedCourse && /^\d+$/.test(courseCode)) return;
    void loadDetail(courseCode);
  }, [selectedId, loadDetail, courses]);

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
            {courses.map((course, index) => {
              const nextBatch = (course.nextBatch ?? null) as ProgramNextBatch | null;
              return (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  subtitle={course.subtitle}
                  duration={course.duration}
                  eligibility={course.eligibility}
                  nextBatchLabel={
                    nextBatch
                      ? `${formatBatchDateCompact(nextBatch.startDate)} · ${nextBatch.capacity > 0 ? `${nextBatch.capacity} seats` : "Seats TBA"}`
                      : "Announcing soon"
                  }
                  cardCoverImage={course.cardCoverImage}
                  programHref={`/courses/${encodeURIComponent(course.id)}`}
                  enrollHref={`/enroll?course=${encodeURIComponent(course.id)}${nextBatch ? `&batch=${encodeURIComponent(String(nextBatch.id))}` : ""}`}
                  imagePriority={index < 2}
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
            {detailCourse && !detailLoading ? (
              <div className="mt-6 text-sm leading-relaxed text-slate-600">
                <p className="font-display text-lg font-bold text-slate-900">
                  {trimOrEmpty(detailCourse.title) || "Course"}
                </p>
                {trimOrUndefined(detailCourse.description) ? (
                  <p className="mt-3">{trimOrEmpty(detailCourse.description)}</p>
                ) : null}
              </div>
            ) : null}

            {batches.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Batches — enroll
                </h3>
                <ul className="mt-4 space-y-3">
                  {batches.map((b) => {
                    const batchNum = b.id;
                    const label = `Batch ${b.id} · ${formatBatchDateCompact(b.startDate)} · ${trimOrEmpty(b.mentorName) || "Faculty"}`;
                    return (
                      <li
                        key={b.id}
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
                            void handleEnroll(batchNum);
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
