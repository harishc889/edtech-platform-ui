import { asRecordList } from "@/lib/api-normalize";
import { mapCourseToProgram } from "@/lib/course-program-adapter";
import { getPublishedCourses } from "@/lib/course-service";
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
  const trimmed = enrollment.courseCode.trim();
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
 */
export async function resolveLearnSlugToCourseCode(slug: string): Promise<string> {
  const trimmed = decodeURIComponent(slug).trim();
  if (!trimmed) return trimmed;
  if (!/^\d+$/.test(trimmed)) return trimmed;

  const targetId = Number(trimmed);
  const res = await getPublishedCourses();
  if (!res.ok) return trimmed;

  const rows = asRecordList(res.data);
  for (const row of rows) {
    const program = mapCourseToProgram(row);
    if (program.apiCourseId === targetId) return program.id;
  }

  return trimmed;
}
