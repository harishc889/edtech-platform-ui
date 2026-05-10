import { asRecordList } from "@/lib/api-normalize";
import { backendRequestSafe } from "@/lib/backend-api-client";
import { liveSessionAdminFromRecord } from "@/lib/live-session-utils";
import type {
  CreateLiveSessionInput,
  LiveSessionAdminView,
} from "@/lib/live-session-types";

async function liveSessionGet<T>(
  segments: string[],
): Promise<ReturnType<typeof backendRequestSafe<T>>> {
  let res = await backendRequestSafe<T>(segments, { method: "GET" });
  if (!res.ok && res.status === 404) {
    const kebab = segments.map((s) =>
      s === "LiveSession" ? "live-session" : s === "Batch" ? "batch" : s,
    );
    res = await backendRequestSafe<T>(kebab, { method: "GET" });
  }
  return res;
}

async function liveSessionWrite<T>(
  segments: string[],
  config: {
    method: "POST" | "DELETE";
    data?: unknown;
  },
): Promise<ReturnType<typeof backendRequestSafe<T>>> {
  let res = await backendRequestSafe<T>(segments, {
    method: config.method,
    data: config.data,
  });
  if (!res.ok && res.status === 404) {
    const kebab = segments.map((s, idx) => {
      if (s === "LiveSession") return "live-session";
      return s;
    });
    res = await backendRequestSafe<T>(kebab, {
      method: config.method,
      data: config.data,
    });
  }
  return res;
}

export async function getLiveSessionsForBatch(
  batchId: number,
): Promise<{
  ok: boolean;
  sessions: LiveSessionAdminView[];
  message: string;
}> {
  const res = await liveSessionGet<unknown>([
    "LiveSession",
    "batch",
    String(batchId),
  ]);
  if (!res.ok) {
    return { ok: false, sessions: [], message: res.message };
  }
  const sessions = asRecordList(res.data).map(liveSessionAdminFromRecord);
  return { ok: true, sessions, message: "" };
}

export async function createLiveSession(
  input: CreateLiveSessionInput,
): Promise<{
  ok: boolean;
  session?: LiveSessionAdminView;
  message: string;
  status: number;
}> {
  const res = await liveSessionWrite<Record<string, unknown>>(
    ["LiveSession"],
    {
      method: "POST",
      data: {
        batchId: input.batchId,
        title: input.title.trim(),
        startTime: input.startTime,
        durationMinutes: input.durationMinutes,
        password: input.password ?? undefined,
        videoProvider: input.videoProvider ?? "Zoom",
      },
    },
  );
  if (!res.ok) {
    return { ok: false, message: res.message, status: res.status };
  }
  if (!res.data || typeof res.data !== "object") {
    return {
      ok: true,
      message: "Session scheduled.",
      status: 201,
    };
  }
  const session = liveSessionAdminFromRecord(res.data);
  return {
    ok: true,
    session,
    message: "Live session created.",
    status: 200,
  };
}

export async function deleteLiveSession(sessionId: number): Promise<{
  ok: boolean;
  message: string;
  status: number;
}> {
  const res = await liveSessionWrite<unknown>(
    ["LiveSession", String(sessionId)],
    { method: "DELETE" },
  );
  if (!res.ok) return { ok: false, message: res.message, status: res.status };
  return { ok: true, message: "Meeting removed.", status: 200 };
}
