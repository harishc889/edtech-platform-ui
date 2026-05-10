import type { Program } from "@/lib/program-catalog";
import type { AdminBatchOption } from "@/lib/live-session-types";
import { formatBatchDateWithWeekday } from "@/lib/display-format";
import { trimOrEmpty } from "@/lib/string-trim";

/** Flatten catalog programs into batch choices for admin live-session flows */
export function buildAdminBatchOptions(programs: Program[]): AdminBatchOption[] {
  return programs.flatMap((p) =>
    (p.batches ?? []).map((b) => ({
      batchId: b.id,
      courseTitle: p.title,
      courseSlug: p.id,
      apiCourseId: p.apiCourseId,
      mentorName: trimOrEmpty(b.mentorName) || "Faculty",
      startDate: b.startDate,
      label: `${p.title} · ${trimOrEmpty(b.mentorName) || "Faculty"} · ${formatBatchDateWithWeekday(b.startDate, { invalidAsRaw: true })}`,
    })),
  );
}
