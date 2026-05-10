import { backendRequestSafe } from "@/lib/backend-api-client";
import type {
  CreateLiveSessionInput,
  LiveSessionBatchItem,
  LiveSessionAdminView,
  LiveSessionMyItem,
} from "@/lib/live-session-types";
import { trimOrEmpty } from "@/lib/string-trim";

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
    data?: CreateLiveSessionInput;
  },
): Promise<ReturnType<typeof backendRequestSafe<T>>> {
  let res = await backendRequestSafe<T>(segments, {
    method: config.method,
    data: config.data,
  });
  if (!res.ok && res.status === 404) {
    const kebab = segments.map((s) => {
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
  sessions: LiveSessionBatchItem[];
  message: string;
}> {
  const res = await liveSessionGet<LiveSessionBatchItem[]>([
    "LiveSession",
    "batch",
    String(batchId),
  ]);
  if (!res.ok) {
    return { ok: false, sessions: [], message: res.message };
  }
  return { ok: true, sessions: res.data, message: "" };
}

export async function createLiveSession(
  input: CreateLiveSessionInput,
): Promise<{
  ok: boolean;
  session?: LiveSessionAdminView;
  message: string;
  status: number;
}> {
  const res = await liveSessionWrite<LiveSessionAdminView>(
    ["LiveSession"],
    {
      method: "POST",
      data: {
        batchId: input.batchId,
        title: trimOrEmpty(input.title),
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
  return {
    ok: true,
    session: res.data,
    message: "Live session created.",
    status: 200,
  };
}

export async function getMyLiveSessions(): Promise<{
  ok: boolean;
  sessions: LiveSessionMyItem[];
  message: string;
}> {
  const res = await liveSessionGet<LiveSessionMyItem[]>(["LiveSession", "my"]);
  if (!res.ok) {
    return { ok: false, sessions: [], message: res.message };
  }
  return { ok: true, sessions: res.data, message: "" };
}

export async function deleteLiveSession(sessionId: number): Promise<{
  ok: boolean;
  message: string;
  status: number;
}> {
  const res = await liveSessionWrite<void>(
    ["LiveSession", String(sessionId)],
    { method: "DELETE" },
  );
  if (!res.ok) return { ok: false, message: res.message, status: res.status };
  return { ok: true, message: "Meeting removed.", status: 200 };
}
