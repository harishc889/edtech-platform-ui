function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export type EnrollmentRow = {
  id: string;
  courseId: string;
  apiCourseId: number;
  courseCode: string;
  title: string;
  progress: number;
  nextSession: string;
};

export function mapEnrollmentRow(
  raw: Record<string, unknown>,
  index: number,
): EnrollmentRow {
  const nestedCourse =
    raw.course && typeof raw.course === "object"
      ? (raw.course as Record<string, unknown>)
      : null;
  const apiCourseId = toNumber(
    raw.courseId ??
      raw.course_id ??
      raw.courseMasterId ??
      nestedCourse?.id ??
      nestedCourse?.courseId,
    Number.NaN,
  );
  const id = String(
    raw.id ?? raw.enrollmentId ?? raw.batchId ?? `row-${index}`,
  );
  const title = String(
    raw.title ??
      raw.courseTitle ??
      raw.courseName ??
      nestedCourse?.title ??
      nestedCourse?.name ??
      raw.name ??
      "Course",
  );
  let progress = 0;
  if (typeof raw.progress === "number") {
    progress = Math.max(0, Math.min(100, Math.round(raw.progress)));
  } else if (typeof raw.progressPercent === "number") {
    progress = Math.max(0, Math.min(100, Math.round(raw.progressPercent)));
  }
  const nextSession =
    typeof raw.nextSession === "string"
      ? raw.nextSession
      : typeof raw.scheduledAt === "string"
        ? raw.scheduledAt
        : "—";
  const courseCode =
    typeof raw.courseCode === "string" && raw.courseCode.trim()
      ? raw.courseCode.trim()
      : typeof nestedCourse?.courseCode === "string" &&
          nestedCourse.courseCode.trim()
        ? nestedCourse.courseCode.trim()
        : typeof raw.slug === "string" && raw.slug.trim()
          ? raw.slug.trim()
          : typeof nestedCourse?.slug === "string" &&
              nestedCourse.slug.trim()
            ? nestedCourse.slug.trim()
            : typeof raw.code === "string" && raw.code.trim()
              ? raw.code.trim()
              : typeof nestedCourse?.code === "string" &&
                  nestedCourse.code.trim()
                ? nestedCourse.code.trim()
                : "";
  const courseId =
    courseCode ||
    (Number.isFinite(apiCourseId) ? String(apiCourseId) : `row-${index}`);
  return { id, courseId, apiCourseId, courseCode, title, progress, nextSession };
}

export function normalizeEnrollmentKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function findEnrollmentForCourse(
  rows: EnrollmentRow[],
  program: { id: string; apiCourseId: number },
  urlCourseCode: string,
): EnrollmentRow | undefined {
  const decoded = decodeURIComponent(urlCourseCode).trim();
  const keys = new Set([
    decoded,
    normalizeEnrollmentKey(decoded),
    program.id,
    normalizeEnrollmentKey(program.id),
    String(program.apiCourseId),
  ]);
  return rows.find(
    (r) =>
      keys.has(r.courseId.trim()) ||
      keys.has(normalizeEnrollmentKey(r.courseId)) ||
      (r.courseCode && keys.has(r.courseCode.trim())) ||
      (r.courseCode && keys.has(normalizeEnrollmentKey(r.courseCode))) ||
      (Number.isFinite(r.apiCourseId) && keys.has(String(r.apiCourseId))),
  );
}
