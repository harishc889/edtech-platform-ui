import type { LiveSessionAdminView } from "@/lib/live-session-types";

function pickNum(...vals: unknown[]): number {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function pickStr(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function pickOptStr(...vals: unknown[]): string | null {
  const s = pickStr(...vals);
  return s || null;
}

/** Map ASP.NET LiveSession JSON (flat record) to a typed admin view */
export function liveSessionAdminFromRecord(
  raw: Record<string, unknown>,
): LiveSessionAdminView {
  const nestedBatch =
    raw.batch && typeof raw.batch === "object"
      ? (raw.batch as Record<string, unknown>)
      : null;

  return {
    id: pickNum(raw.id, raw.liveSessionId),
    batchId: pickNum(
      raw.batchId,
      nestedBatch?.id,
      nestedBatch?.batchId,
    ),
    title: pickStr(raw.title, raw.sessionTitle, raw.name) || "Live session",
    meetingUrl: pickStr(
      raw.meetingUrl,
      raw.joinUrl,
      raw.meetingJoinUrl,
      raw.zoomJoinUrl,
    ),
    meetingId: pickOptStr(raw.meetingId, raw.zoomMeetingId),
    hostUrl: pickOptStr(raw.hostUrl, raw.hostJoinUrl, raw.startUrl),
    provider: pickStr(raw.provider, raw.videoProvider) || "Zoom",
    startTime: pickStr(raw.startTime, raw.startsAt, raw.scheduledAt),
    endTime: pickOptStr(raw.endTime, raw.endsAt),
    durationMinutes: pickNum(raw.durationMinutes, raw.duration, 60),
    password: pickOptStr(raw.password, raw.meetingPassword),
  };
}
