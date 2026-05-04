import type {
  CourseLesson,
  CourseModule,
  CourseResourceLink,
  Program,
} from "@/lib/program-catalog";

function pickString(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function inferResourceKind(
  url: string,
  explicit?: string,
): CourseResourceLink["kind"] {
  const k = explicit?.toLowerCase();
  if (k === "pdf" || k === "zip" || k === "model" || k === "link") return k;
  const u = url.toLowerCase();
  if (u.endsWith(".pdf")) return "pdf";
  if (u.endsWith(".zip") || u.endsWith(".rar")) return "zip";
  if (/\.(rvt|nwd|nwf|ifc|dwg)(\?|$)/i.test(u)) return "model";
  return "link";
}

function mapResourceRow(
  raw: Record<string, unknown>,
  idx: number,
): CourseResourceLink | null {
  const url = pickString(raw.url, raw.href, raw.downloadUrl, raw.fileUrl);
  if (!url) return null;
  const title =
    pickString(raw.title, raw.name, raw.fileName) ?? `Resource ${idx + 1}`;
  const kindRaw = pickString(raw.kind, raw.type);
  return { title, url, kind: inferResourceKind(url, kindRaw) };
}

function mapResources(value: unknown): CourseResourceLink[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  const out: CourseResourceLink[] = [];
  value.forEach((item, idx) => {
    if (!item || typeof item !== "object") return;
    const row = mapResourceRow(item as Record<string, unknown>, idx);
    if (row) out.push(row);
  });
  return out.length ? out : undefined;
}

function mapLesson(raw: Record<string, unknown>, idx: number): CourseLesson {
  const id =
    pickString(raw.id, raw.lessonId, raw.contentId) ?? `lesson-${idx + 1}`;
  const title =
    pickString(raw.title, raw.name, raw.lessonTitle) ?? `Lesson ${idx + 1}`;
  const videoUrl = pickString(
    raw.videoUrl,
    raw.videoURL,
    raw.embedUrl,
    raw.streamUrl,
    raw.youtubeUrl,
  );
  const durationLabel = pickString(raw.duration, raw.durationLabel, raw.length);
  const resources = mapResources(
    raw.resources ?? raw.attachments ?? raw.downloads ?? raw.files,
  );
  return { id, title, durationLabel, videoUrl, resources };
}

function mapLessons(value: unknown): CourseLesson[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  const out: CourseLesson[] = [];
  value.forEach((item, idx) => {
    if (!item || typeof item !== "object") return;
    out.push(mapLesson(item as Record<string, unknown>, idx));
  });
  return out.length ? out : undefined;
}

function mapCourseModule(raw: Record<string, unknown>, index: number): CourseModule {
  const title =
    typeof raw.title === "string" && raw.title.trim()
      ? raw.title
      : `Module ${index + 1}`;
  const hours =
    typeof raw.hours === "string" && raw.hours.trim() ? raw.hours : "—";
  const desc =
    typeof raw.desc === "string" && raw.desc.trim()
      ? raw.desc
      : typeof raw.description === "string" && raw.description.trim()
        ? raw.description
        : "Module details will be shared soon.";

  let lessons = mapLessons(raw.lessons ?? raw.contents ?? raw.curriculum ?? raw.videos);
  const moduleResources = mapResources(
    raw.resources ?? raw.attachments ?? raw.downloads ?? raw.files,
  );
  const moduleVideo = pickString(raw.videoUrl, raw.introVideoUrl);

  let resources = moduleResources;
  if ((!lessons || lessons.length === 0) && moduleVideo) {
    lessons = [
      {
        id: `${index}-module-video`,
        title:
          pickString(raw.lessonTitle, raw.firstLessonTitle) ?? "Video lecture",
        videoUrl: moduleVideo,
        resources: moduleResources,
      },
    ];
    resources = undefined;
  }

  return {
    title,
    hours,
    desc,
    lessons,
    resources,
  };
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
    const normalized = value.replace(/[^\d.]/g, "");
    const extracted = Number(normalized);
    if (Number.isFinite(extracted)) return extracted;
  }
  return fallback;
}

function toStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);
}

function deriveHours(raw: Record<string, unknown>): string {
  const directHours = toNumber(
    raw.hours ??
      raw.totalHours ??
      raw.durationHours ??
      raw.courseHours ??
      raw.noOfHours,
    0,
  );
  if (directHours > 0) return `${directHours} Hours`;

  if (Array.isArray(raw.modules)) {
    const moduleHoursTotal = (raw.modules as Array<Record<string, unknown>>)
      .map((m) => toNumber(m.hours ?? m.durationHours ?? m.totalHours, 0))
      .reduce((sum, n) => sum + n, 0);
    if (moduleHoursTotal > 0) return `${moduleHoursTotal} Hours`;
  }

  return "—";
}

export function mapCourseToProgram(
  raw: Record<string, unknown>,
  fallbackId?: string,
): Program {
  const apiCourseId = toNumber(raw.id ?? raw.courseId, 0);
  const idSource =
    typeof raw.courseCode === "string" && raw.courseCode.trim()
      ? raw.courseCode.trim()
      : typeof raw.code === "string" && raw.code.trim()
        ? raw.code.trim()
        : typeof raw.slug === "string" && raw.slug.trim()
          ? raw.slug.trim()
          : fallbackId ?? String(apiCourseId || "course");
  const id = idSource.replace(/\s+/g, "-");

  const title =
    typeof raw.title === "string" && raw.title.trim()
      ? raw.title.trim()
      : typeof raw.name === "string" && raw.name.trim()
        ? raw.name.trim()
        : "Course";

  const subtitle =
    typeof raw.subtitle === "string" && raw.subtitle.trim()
      ? raw.subtitle.trim()
      : typeof raw.shortDescription === "string" && raw.shortDescription.trim()
        ? raw.shortDescription.trim()
        : `${title} program`;

  const durationWeeks = toNumber(raw.durationWeeks, 0);
  const duration =
    typeof raw.duration === "string" && raw.duration.trim()
      ? raw.duration.trim()
      : durationWeeks > 0
        ? `${durationWeeks} weeks`
        : "Flexible";

  const hours = deriveHours(raw);

  const upfrontInr = toNumber(
    raw.upfrontInr ?? raw.upfrontAmount ?? raw.price ?? raw.amount,
    0,
  );
  const seatBookingInr = toNumber(
    raw.seatBookingInr ?? raw.bookingAmount ?? raw.registrationAmount,
    Math.min(upfrontInr || 5000, 5000),
  );

  const description =
    typeof raw.description === "string" && raw.description.trim()
      ? raw.description.trim()
      : undefined;

  return {
    id,
    title,
    subtitle,
    duration,
    hours,
    internshipDuration:
      typeof raw.internshipDuration === "string"
        ? raw.internshipDuration
        : "—",
    internshipHours:
      typeof raw.internshipHours === "string" ? raw.internshipHours : "—",
    language: typeof raw.language === "string" ? raw.language : "English",
    mode: typeof raw.mode === "string" ? raw.mode : "Online",
    assessments:
      typeof raw.assessments === "string" ? raw.assessments : String(toNumber(raw.assessments, 0)),
    eligibility:
      typeof raw.eligibility === "string" ? raw.eligibility : "Open to learners",
    cardCoverImage:
      typeof raw.cardCoverImage === "string" ? raw.cardCoverImage : undefined,
    courseDetailCoverImage:
      typeof raw.courseDetailCoverImage === "string"
        ? raw.courseDetailCoverImage
        : undefined,
    level: typeof raw.level === "string" ? raw.level : undefined,
    description,
    highlights: toStringArray(raw.highlights, []),
    engineeringBenefits: toStringArray(raw.engineeringBenefits, []),
    modules:
      Array.isArray(raw.modules) && raw.modules.length > 0
        ? (raw.modules as Array<Record<string, unknown>>).map((m, i) =>
            mapCourseModule(m, i),
          )
        : [
            {
              title: "Overview",
              hours: "—",
              desc: description ?? "Course details.",
            },
          ],
    tools: Array.isArray(raw.tools)
      ? (raw.tools as Array<Record<string, unknown>>).map((t) => ({
          name: typeof t.name === "string" ? t.name : "Tool",
          imagePath: typeof t.imagePath === "string" ? t.imagePath : "",
        }))
      : [],
    certifications: Array.isArray(raw.certifications)
      ? (raw.certifications as Array<Record<string, unknown>>).map((c) => ({
          title: typeof c.title === "string" ? c.title : "Certificate",
          description:
            typeof c.description === "string"
              ? c.description
              : "Certificate details",
          imagePath: typeof c.imagePath === "string" ? c.imagePath : "",
        }))
      : [],
    faqs: Array.isArray(raw.faqs)
      ? (raw.faqs as Array<Record<string, unknown>>).map((f, idx) => ({
          id: toNumber(f.id, idx + 1),
          question:
            typeof f.question === "string"
              ? f.question
              : typeof f.q === "string"
                ? f.q
                : "FAQ",
          answerHtml:
            typeof f.answerHtml === "string"
              ? f.answerHtml
              : "<p>Details coming soon.</p>",
          order: toNumber(f.order, idx + 1),
        }))
      : [],
    learningOutcomes: toStringArray(raw.learningOutcomes, []),
    careerRoles: toStringArray(raw.careerRoles, []),
    criteriaSummary: {
      totalCredits:
        typeof raw.totalCredits === "string"
          ? raw.totalCredits
          : typeof raw.criteriaTotalCredits === "string"
            ? raw.criteriaTotalCredits
            : "—",
      minimumScore:
        typeof raw.minimumScore === "string"
          ? raw.minimumScore
          : typeof raw.criteriaMinimumScore === "string"
            ? raw.criteriaMinimumScore
            : "—",
      description:
        typeof raw.criteriaDescription === "string"
          ? raw.criteriaDescription
          : "Assessment criteria will be shared by the academy.",
    },
    upfrontInr,
    seatBookingInr,
    apiCourseId,
    defaultBatchId: toNumber(raw.defaultBatchId ?? raw.batchId, 1),
  };
}
