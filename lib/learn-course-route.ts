import { getCachedPrograms } from "@/lib/client-course-cache";
import { trimOrEmpty } from "@/lib/string-trim";
import type { EnrollmentRow } from "@/lib/enrollment-map";
import type { Program } from "@/lib/program-catalog";

/**
 * Returns the course slug used in URLs and for GET /Course/{courseCode}.
 * When enrollment only has numeric DB id, resolves via published catalog.
 */
export function getLearnCourseSlugForEnrollment(
  enrollment: EnrollmentRow,
  catalog: Pick<Program, "id" | "apiCourseId">[],
): string {
  const trimmed = trimOrEmpty(enrollment.courseCode);
  if (trimmed) return trimmed;
  if (Number.isFinite(enrollment.apiCourseId)) {
    const hit = catalog.find((p) => p.apiCourseId === enrollment.apiCourseId);
    if (hit?.id) return hit.id;
  }
  return enrollment.courseId;
}

export function learnHrefForEnrollment(
  enrollment: EnrollmentRow,
  catalog: Pick<Program, "id" | "apiCourseId">[],
): string {
  return `/dashboard/learn/${encodeURIComponent(getLearnCourseSlugForEnrollment(enrollment, catalog))}`;
}

/**
 * Learn URL segment may be numeric (enrollment fallback). Map to API courseCode/slug.
 * Uses the shared client-side course cache so we don't hit `/api/Course` again
 * if another component (header, dashboard, enroll form) already loaded it.
 */
export async function resolveLearnSlugToCourseCode(slug: string): Promise<string> {
  const trimmed = decodeURIComponent(slug).trim();
  if (!trimmed) return trimmed;
  if (!/^\d+$/.test(trimmed)) return trimmed;

  const targetId = Number(trimmed);
  const programs = await getCachedPrograms();
  for (const program of programs) {
    if (program.apiCourseId === targetId) return program.id;
  }

  return trimmed;
}
