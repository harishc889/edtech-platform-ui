import type {
  CourseByCodeDto,
  CourseBatchDto,
  CourseModuleDto,
  PublishedCourseDto,
} from "@/lib/course-api-types";
import type { CourseModule, ProgramBatch, Program } from "@/lib/program-catalog";
import { trimOrEmpty } from "@/lib/string-trim";

/**
 * API may send newline-separated strings or string arrays (camelCase JSON).
 */
function normalizeListField(
  value: string | string[] | null | undefined,
): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.map((x) => trimOrEmpty(x)).filter(Boolean);
  }
  const parts = value.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  return parts.length > 0 ? parts : value.trim() ? [value.trim()] : [];
}

function parseHourScalar(h: number | string): number {
  if (typeof h === "number" && Number.isFinite(h)) return h;
  if (typeof h === "string") {
    const m = h.trim().match(/^(\d+(?:\.\d+)?)/);
    if (m) return Number(m[1]);
  }
  return 0;
}

/** Module hours: number, or strings like "10 Hours" from the API. */
function normalizeModuleHours(h: CourseModuleDto["hours"]): string {
  if (typeof h === "number" && Number.isFinite(h) && h > 0) {
    return `${h} Hours`;
  }
  const s = typeof h === "string" ? h.trim() : "";
  if (!s) return "—";
  return /\bhour/i.test(s) ? s : `${s} Hours`;
}

/** Course-level hours: number or strings like "230 Hours". */
function normalizeCourseHoursDisplay(h: PublishedCourseDto["hours"]): string {
  if (typeof h === "number" && Number.isFinite(h) && h > 0) {
    return `${h} Hours`;
  }
  const s = typeof h === "string" ? h.trim() : "";
  if (!s) return "—";
  return /\bhour/i.test(s) ? s : `${s} Hours`;
}

function stringifyCriterion(value: number | string | null | undefined): string {
  if (value == null) return "—";
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  const s = typeof value === "string" ? trimOrEmpty(value) : "";
  return s || "—";
}

function programBatchFromDto(batch: CourseBatchDto, courseId: number): ProgramBatch {
  return {
    id: batch.id,
    courseId,
    startDate: batch.startDate,
    endDate: batch.endDate,
    mentorName: batch.mentorName,
    capacity: batch.capacity,
  };
}

function courseModuleFromDto(m: CourseModuleDto, index: number): CourseModule {
  const hours = normalizeModuleHours(m.hours);
  const title = trimOrEmpty(m.title) || `Module ${index + 1}`;
  const desc =
    trimOrEmpty(m.description) || "Module details will be shared soon.";
  return { title, hours, desc };
}

/** Maps GET /api/Course/{courseCode} response (Swagger) to catalog {@link Program}. */
export function mapCourseByCodeDtoToProgram(
  dto: CourseByCodeDto,
  fallbackSlug: string,
): Program {
  const apiCourseId = dto.id;
  const idSource =
    trimOrEmpty(dto.courseCode) ||
    fallbackSlug.trim() ||
    String(apiCourseId || "course");
  const id = idSource.replace(/\s+/g, "-");

  const moduleHoursTotal = dto.modules.reduce(
    (sum, m) => sum + parseHourScalar(m.hours),
    0,
  );
  const hours =
    moduleHoursTotal > 0
      ? `${moduleHoursTotal} Hours`
      : normalizeCourseHoursDisplay(dto.hours);

  const batches =
    dto.batches.length > 0
      ? dto.batches.map((b) => programBatchFromDto(b, apiCourseId))
      : undefined;

  const defaultBatchId = dto.batches[0]?.id ?? 1;

  return {
    id,
    title: trimOrEmpty(dto.title) || "Course",
    subtitle:
      trimOrEmpty(dto.subtitle) ||
      `${trimOrEmpty(dto.title) || "Course"} program`,
    duration: trimOrEmpty(dto.duration) || "Flexible",
    hours,
    internshipDuration: trimOrEmpty(dto.internshipDuration) || "—",
    internshipHours:
      dto.internshipHours != null &&
      Number.isFinite(Number(dto.internshipHours)) &&
      Number(dto.internshipHours) > 0
        ? String(dto.internshipHours)
        : "—",
    language: trimOrEmpty(dto.language) || "English",
    mode: trimOrEmpty(dto.mode) || "Online",
    assessments: trimOrEmpty(dto.assessments) || "—",
    eligibility: trimOrEmpty(dto.eligibility) || "Open to learners",
    cardCoverImage: trimOrEmpty(dto.cardCoverImage) || undefined,
    courseDetailCoverImage: trimOrEmpty(dto.courseDetailCoverImage) || undefined,
    description: trimOrEmpty(dto.description) || undefined,
    highlights: normalizeListField(dto.highlights),
    engineeringBenefits: normalizeListField(dto.engineeringBenefits),
    modules:
      dto.modules.length > 0
        ? dto.modules.map((m, i) => courseModuleFromDto(m, i))
        : [
            {
              title: "Overview",
              hours: "—",
              desc: trimOrEmpty(dto.description) || "Course details.",
            },
          ],
    tools: dto.tools.map((t) => ({
      name: trimOrEmpty(t.name) || "Tool",
      imagePath: trimOrEmpty(t.imagePath) || "",
    })),
    certifications: dto.certifications.map((c) => ({
      title: trimOrEmpty(c.title) || "Certificate",
      description: trimOrEmpty(c.description) || "Certificate details",
      imagePath: trimOrEmpty(c.imagePath) || "",
    })),
    faqs: dto.faqs.map((f, idx) => ({
      id: f.id,
      question: trimOrEmpty(f.question) || "FAQ",
      answerHtml: trimOrEmpty(f.answerHtml) || "<p>Details coming soon.</p>",
      order: f.order || idx + 1,
    })),
    learningOutcomes: normalizeListField(dto.learningOutcomes),
    careerRoles: normalizeListField(dto.careerRoles),
    batches,
    nextBatch: null,
    criteriaSummary: {
      totalCredits: stringifyCriterion(dto.criteriaTotalCredits),
      minimumScore: stringifyCriterion(dto.criteriaMinimumScore),
      description:
        trimOrEmpty(dto.criteriaDescription) ||
        "Assessment criteria will be shared by the academy.",
    },
    upfrontInr: dto.upfrontInr,
    seatBookingInr: dto.seatBookingInr,
    apiCourseId,
    defaultBatchId,
  };
}
