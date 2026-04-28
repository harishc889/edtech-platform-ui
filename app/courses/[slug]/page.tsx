"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CourseDetailShowcase from "@/app/components/course-detail-showcase";
import { asRecordList } from "@/lib/api-normalize";
import { getBatchesForCourse } from "@/lib/batch-service";
import { mapCourseToProgram } from "@/lib/course-program-adapter";
import { getCourseById } from "@/lib/course-service";
import type { Program } from "@/lib/program-catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type CourseBatch = {
  id: number;
  mentorName: string;
  startDate: string;
  endDate: string;
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

function toBatch(raw: Record<string, unknown>, index: number): CourseBatch {
  const id = toNumber(raw.id ?? raw.batchId, index + 1);
  const mentorName =
    typeof raw.mentorName === "string" && raw.mentorName.trim()
      ? raw.mentorName.trim()
      : "Faculty will be assigned";
  const startDate =
    typeof raw.startDate === "string" ? raw.startDate : String(raw.startDate ?? "");
  const endDate =
    typeof raw.endDate === "string" ? raw.endDate : String(raw.endDate ?? "");
  const capacity = toNumber(raw.capacity, 0);
  return { id, mentorName, startDate, endDate, capacity };
}

export default function CourseDetailPage({ params }: PageProps) {
  const [slug, setSlug] = useState<string>("");
  const [course, setCourse] = useState<Program | null>(null);
  const [batches, setBatches] = useState<CourseBatch[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void params.then((p) => {
      if (!active) return;
      setSlug(p.slug);
    });
    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    void getCourseById(slug).then((res) => {
      if (!active) return;
      if (!res.ok) {
        setError(res.message);
        setLoading(false);
        return;
      }
      const body =
        res.data && typeof res.data === "object"
          ? (res.data as Record<string, unknown>)
          : null;
      if (!body) {
        setError("Course details are unavailable.");
        setLoading(false);
        return;
      }
      setCourse(mapCourseToProgram(body, slug));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!course?.apiCourseId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBatches([]);
      setSelectedBatchId(null);
      return;
    }
    let active = true;
    setBatchesLoading(true);
    void getBatchesForCourse(course.apiCourseId).then((res) => {
      if (!active) return;
      if (!res.ok) {
        setBatches([]);
        setBatchesLoading(false);
        return;
      }
      const mapped = asRecordList(res.data)
        .map(toBatch)
        .filter((batch) => Number.isFinite(batch.id));
      setBatches(mapped);
      setSelectedBatchId(mapped[0]?.id ?? null);
      setBatchesLoading(false);
    });
    return () => {
      active = false;
    };
  }, [course?.apiCourseId]);

  const enrollHref = useMemo(
    () =>
      `/enroll?course=${encodeURIComponent(course?.id ?? slug)}${selectedBatchId ? `&batch=${encodeURIComponent(String(selectedBatchId))}` : ""}`,
    [course?.id, selectedBatchId, slug],
  );
  const courseFeeInr = new Intl.NumberFormat("en-IN").format(
    course?.upfrontInr && Number.isFinite(course.upfrontInr)
      ? course.upfrontInr
      : 0,
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm">
          <Link
            href="/#courses"
            className="font-semibold text-cyan-700 transition hover:text-cyan-600"
          >
            ← Featured courses
          </Link>
        </nav>
        {loading ? (
          <p className="text-sm text-slate-600">Loading course details...</p>
        ) : null}
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : null}
        {course && !loading ? (
          <CourseDetailShowcase
            course={course}
            enrollHref={enrollHref}
            courseFeeInr={courseFeeInr}
            batches={batches}
            batchesLoading={batchesLoading}
            selectedBatchId={selectedBatchId}
            onSelectBatch={(batchId) => setSelectedBatchId(batchId)}
          />
        ) : null}
      </div>
    </main>
  );
}
