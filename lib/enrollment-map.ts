import type { MyEnrolledCourseItem } from "@/lib/enroll-types";
import { trimOrEmpty } from "@/lib/string-trim";

export type EnrollmentRow = {
  id: string;
  courseId: string;
  apiCourseId: number;
  batchId: number;
  courseCode: string;
  title: string;
  progress: number;
  nextSession: string;
};

/**
 * Maps GET /api/Enroll/my-courses items to dashboard rows.
 * Batch id comes from {@link MyEnrolledCourseItem.batch.id} only (Swagger shape).
 */
export function enrollmentRowFromMyCourse(item: MyEnrolledCourseItem): EnrollmentRow {
  const apiCourseId = item.course.id;
  const batchId = item.batch.id;
  return {
    id: String(item.enrollmentId),
    courseId: String(apiCourseId),
    apiCourseId,
    batchId,
    courseCode: "",
    title: item.course.title,
    progress: 0,
    nextSession: "—",
  };
}

export function normalizeEnrollmentKey(value: string) {
  return trimOrEmpty(value).toLowerCase().replace(/\s+/g, "-");
}

export function findEnrollmentForCourse(
  rows: EnrollmentRow[],
  program: { id: string; apiCourseId: number },
  urlCourseCode: string,
): EnrollmentRow | undefined {
  const decoded = trimOrEmpty(decodeURIComponent(urlCourseCode));
  const keys = new Set([
    decoded,
    normalizeEnrollmentKey(decoded),
    program.id,
    normalizeEnrollmentKey(program.id),
    String(program.apiCourseId),
  ]);
  return rows.find(
    (r) =>
      keys.has(trimOrEmpty(r.courseId)) ||
      keys.has(normalizeEnrollmentKey(r.courseId)) ||
      (r.courseCode && keys.has(trimOrEmpty(r.courseCode))) ||
      (r.courseCode && keys.has(normalizeEnrollmentKey(r.courseCode))) ||
      (Number.isFinite(r.apiCourseId) && keys.has(String(r.apiCourseId))),
  );
}
