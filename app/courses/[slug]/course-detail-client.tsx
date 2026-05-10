"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CourseDetailShowcase from "@/app/components/course-detail-showcase";
import type { BatchByCourseDto } from "@/lib/batch-types";
import { getBatchesForCourse } from "@/lib/batch-service";
import { mapCourseByCodeDtoToProgram } from "@/lib/course-program-adapter";
import { getCourseById } from "@/lib/course-service";
import type { Program } from "@/lib/program-catalog";
import { trimOrEmpty } from "@/lib/string-trim";

type Props = {
  slug: string;
};

type CourseBatch = {
  id: number;
  mentorName: string;
  startDate: string;
  endDate: string;
  capacity: number;
};

function uiBatchFromDto(dto: BatchByCourseDto): CourseBatch {
  return {
    id: dto.id,
    mentorName: trimOrEmpty(dto.mentorName) || "Faculty will be assigned",
    startDate: dto.startDate,
    endDate: dto.endDate,
    capacity: dto.capacity,
  };
}

export default function CourseDetailClient({ slug }: Props) {
  const [course, setCourse] = useState<Program | null>(null);
  const [batches, setBatches] = useState<CourseBatch[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    void getCourseById(slug).then((res) => {
      if (!active) return;
      if (!res.ok) {
        setError(res.message);
        setLoading(false);
        return;
      }
      const dto = res.data;
      if (!dto) {
        setError("Course details are unavailable.");
        setLoading(false);
        return;
      }
      setCourse(mapCourseByCodeDtoToProgram(dto, slug));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!course?.apiCourseId) {
      setBatches([]);
      setSelectedBatchId(null);
      return;
    }
    let active = true;
    setBatchesLoading(true);
    void getBatchesForCourse(course.apiCourseId).then((res) => {
      if (!active) return;
      if (!res.ok || !res.data) {
        setBatches([]);
        setBatchesLoading(false);
        return;
      }
      const mapped = res.data.map(uiBatchFromDto).filter((b) => Number.isFinite(b.id));
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
