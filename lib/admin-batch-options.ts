import type { Program } from "@/lib/program-catalog";
import type { AdminBatchOption } from "@/lib/live-session-types";

function formatBatchDate(value: string) {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(dt);
}

/** Flatten catalog programs into batch choices for admin live-session flows */
export function buildAdminBatchOptions(programs: Program[]): AdminBatchOption[] {
  return programs.flatMap((p) =>
    (p.batches ?? []).map((b) => ({
      batchId: b.id,
      courseTitle: p.title,
      courseSlug: p.id,
      apiCourseId: p.apiCourseId,
      mentorName: b.mentorName?.trim() || "Faculty",
      startDate: b.startDate,
      label: `${p.title} · ${b.mentorName?.trim() || "Faculty"} · ${formatBatchDate(b.startDate)}`,
    })),
  );
}
