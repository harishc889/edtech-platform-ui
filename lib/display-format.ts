import { trimOrEmpty } from "@/lib/string-trim";

const LOCALE_IN = "en-IN";

/** Batch start date for cards and learner UI (`10 May 2026`). */
export function formatBatchDateCompact(value: string, emptyLabel = "TBA"): string {
  if (!trimOrEmpty(value)) return emptyLabel;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return emptyLabel;
  return new Intl.DateTimeFormat(LOCALE_IN, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dt);
}

/**
 * Batch label with weekday for admin dropdowns (`Wed, 10 May 2026`).
 * Invalid ISO returns `empty` by default; set `invalidAsRaw` to echo the input (legacy admin behavior).
 */
export function formatBatchDateWithWeekday(
  value: string,
  opts?: { empty?: string; invalidAsRaw?: boolean },
): string {
  const empty = opts?.empty ?? "";
  if (!trimOrEmpty(value)) return empty;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return opts?.invalidAsRaw ? value : empty;
  }
  return new Intl.DateTimeFormat(LOCALE_IN, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(dt);
}

/** Live session / meeting start for learner-facing copy. */
export function formatSessionStartDisplay(
  value: string,
  emptyLabel = "Time to be announced",
): string {
  if (!trimOrEmpty(value)) return emptyLabel;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return emptyLabel;
  return new Intl.DateTimeFormat(LOCALE_IN, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dt);
}

/** Whole rupees, Indian grouping (`₹12,345`). */
export function formatInrWhole(amount: number): string {
  return `₹${new Intl.NumberFormat(LOCALE_IN, {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}
