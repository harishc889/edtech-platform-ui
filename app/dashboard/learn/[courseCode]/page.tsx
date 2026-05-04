"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EnrolledCoursePlayer from "@/app/components/enrolled-course-player";
import {
  asRecordList,
  enrollmentsFromMePayload,
} from "@/lib/api-normalize";
import { fetchCurrentUser } from "@/lib/auth-service";
import { mapCourseToProgram } from "@/lib/course-program-adapter";
import { resolveLearnSlugToCourseCode } from "@/lib/learn-course-route";
import { getCourseById } from "@/lib/course-service";
import { getMyEnrolledCourses } from "@/lib/enroll-service";
import {
  findEnrollmentForCourse,
  mapEnrollmentRow,
} from "@/lib/enrollment-map";
import {
  certificationsFromMePayload,
  mapCertificationRow,
} from "@/lib/me-certifications";
import type { Program } from "@/lib/program-catalog";

type PageProps = {
  params: Promise<{ courseCode: string }>;
};

export default function DashboardLearnCoursePage({ params }: PageProps) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Program | null>(null);
  const [progress, setProgress] = useState(0);
  const [certifications, setCertifications] = useState<
    ReturnType<typeof mapCertificationRow>[]
  >([]);

  useEffect(() => {
    let active = true;
    void params.then((p) => {
      if (!active) return;
      setSlug(decodeURIComponent(p.courseCode));
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
    setCourse(null);

    async function run() {
      const auth = await fetchCurrentUser();
      if (!active) return;
      if (!auth.ok) {
        router.replace(`/login?next=${encodeURIComponent(`/dashboard/learn/${encodeURIComponent(slug)}`)}`);
        return;
      }

      const payload = auth.data;
      const meRows = enrollmentsFromMePayload(payload);
      const fallbackResponse = await getMyEnrolledCourses();
      if (!active) return;
      const fallbackRows = fallbackResponse.ok
        ? asRecordList(fallbackResponse.data)
        : [];
      const mergedRows = [...meRows, ...fallbackRows];
      const enrollmentRows = mergedRows.map(mapEnrollmentRow);
      const seen = new Set<string>();
      const deduped = enrollmentRows.filter((row) => {
        const key = `${row.courseId}|${row.courseCode}|${row.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const certRows = certificationsFromMePayload(payload);
      setCertifications(certRows.map(mapCertificationRow));

      const courseCodeForApi = await resolveLearnSlugToCourseCode(slug);
      const courseRes = await getCourseById(courseCodeForApi);
      if (!active) return;
      if (!courseRes.ok) {
        setError(courseRes.message);
        setLoading(false);
        return;
      }
      const body =
        courseRes.data && typeof courseRes.data === "object"
          ? (courseRes.data as Record<string, unknown>)
          : null;
      if (!body) {
        setError("Course details are unavailable.");
        setLoading(false);
        return;
      }

      const program = mapCourseToProgram(body, courseCodeForApi);
      const enrollment = findEnrollmentForCourse(deduped, program, slug);
      if (!enrollment) {
        router.replace("/dashboard");
        return;
      }

      setCourse(program);
      setProgress(enrollment.progress);
      setLoading(false);
    }

    void run();
    return () => {
      active = false;
    };
  }, [router, slug]);

  if (!slug || loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-16 text-slate-300">
        <div className="mx-auto max-w-lg">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-800" />
          <p className="mt-6 text-sm">Loading your classroom…</p>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-16 text-slate-300">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          <p className="font-semibold text-white">Unable to open course</p>
          <p className="mt-2 text-sm text-slate-400">{error ?? "Unknown error."}</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <EnrolledCoursePlayer
      course={course}
      progressPercent={progress}
      certifications={certifications}
    />
  );
}
