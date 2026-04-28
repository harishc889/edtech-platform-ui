"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/app/components/course-card";
import { asRecordList } from "@/lib/api-normalize";
import { getBatchesForCourse } from "@/lib/batch-service";
import { mapCourseToProgram } from "@/lib/course-program-adapter";
import { getPublishedCourses } from "@/lib/course-service";
import type { Program } from "@/lib/program-catalog";

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
  return {
    id: best.id,
    startDate: best.startDate,
    capacity: best.capacity,
  };
}

export default function FeaturedPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [nextBatchByCourseId, setNextBatchByCourseId] = useState<
    Record<string, NextBatchPreview>
  >({});

  useEffect(() => {
    let active = true;
    void getPublishedCourses().then((res) => {
      if (!active || !res.ok) return;
      const rows = asRecordList(res.data);
      setPrograms(rows.map((row) => mapCourseToProgram(row)));
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (programs.length === 0) return;
    let active = true;
    void Promise.all(
      programs.map(async (program) => {
        const courseId = program.apiCourseId;
        if (!courseId) return { programId: program.id, nextBatch: null };
        const res = await getBatchesForCourse(courseId);
        if (!res.ok) return { programId: program.id, nextBatch: null };
        const rows = asRecordList(res.data);
        return { programId: program.id, nextBatch: pickNearestBatch(rows) };
      }),
    ).then((results) => {
      if (!active) return;
      const mapped: Record<string, NextBatchPreview> = {};
      results.forEach((item) => {
        if (item.nextBatch) {
          mapped[item.programId] = item.nextBatch;
        }
      });
      setNextBatchByCourseId(mapped);
    });
    return () => {
      active = false;
    };
  }, [programs]);

  return (
    <section
      id="courses"
      className="bg-mesh px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">
            Your global career starts here
          </p> */}
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Our courses
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            Our courses are structured with a practical approach, combining theoretical knowledge + live project training to ensure you gain hands-on experience.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {programs.map((program) => {
            const programHref = `/courses/${program.id}`;
            const nextBatch = nextBatchByCourseId[program.id];
            const enrollHref = `/enroll?course=${encodeURIComponent(program.id)}${nextBatch ? `&batch=${encodeURIComponent(String(nextBatch.id))}` : ""}`;
            return (
              <CourseCard
                key={program.id}
                title={program.title}
                subtitle={program.subtitle}
                duration={program.duration}
                eligibility={program.eligibility}
                nextBatchLabel={
                  nextBatch
                    ? `${formatBatchDate(nextBatch.startDate)} · ${nextBatch.capacity > 0 ? `${nextBatch.capacity} seats` : "Seats TBA"}`
                    : "Announcing soon"
                }
                cardCoverImage={program.cardCoverImage}
                programHref={programHref}
                enrollHref={enrollHref}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
