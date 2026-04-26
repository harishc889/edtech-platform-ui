"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CourseDetailShowcase from "@/app/components/course-detail-showcase";
import { mapCourseToProgram } from "@/lib/course-program-adapter";
import { getCourseById } from "@/lib/course-service";
import type { Program } from "@/lib/program-catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function CourseDetailPage({ params }: PageProps) {
  const [slug, setSlug] = useState<string>("");
  const [course, setCourse] = useState<Program | null>(null);
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

  const enrollHref = useMemo(
    () => `/enroll?course=${encodeURIComponent(course?.id ?? slug)}`,
    [course?.id, slug],
  );
  const courseFeeInr = useMemo(
    () =>
      new Intl.NumberFormat("en-IN").format(
        course?.upfrontInr && Number.isFinite(course.upfrontInr)
          ? course.upfrontInr
          : 0,
      ),
    [course?.upfrontInr],
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
          />
        ) : null}
      </div>
    </main>
  );
}
