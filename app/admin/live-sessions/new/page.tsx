"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminAccessGate } from "@/app/components/admin/admin-access-gate";
import { AdminPageHeader } from "@/app/components/admin/admin-page-header";
import { useToast } from "@/app/components/toast-provider";
import { asRecordList } from "@/lib/api-normalize";
import { buildAdminBatchOptions } from "@/lib/admin-batch-options";
import { getBatchesForCourse } from "@/lib/batch-service";
import { getCachedPrograms } from "@/lib/client-course-cache";
import { createLiveSession } from "@/lib/live-session-service";
import type {
  AdminBatchOption,
  LiveSessionAdminView,
} from "@/lib/live-session-types";
import type { Program } from "@/lib/program-catalog";

const DURATION_PRESETS = [45, 60, 90, 120, 180];

export default function AdminNewLiveSessionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [batchOptions, setBatchOptions] = useState<AdminBatchOption[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const [courseSlug, setCourseSlug] = useState("");
  const [batchId, setBatchId] = useState("");
  const [title, setTitle] = useState("");
  const [startLocal, setStartLocal] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<LiveSessionAdminView | null>(null);

  useEffect(() => {
    let active = true;
    void getCachedPrograms()
      .then((rows) => {
        if (!active) return;
        setPrograms(rows);
        setBatchOptions(buildAdminBatchOptions(rows));
      })
      .finally(() => {
        if (!active) return;
        setCatalogLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedProgram = useMemo(
    () => programs.find((p) => p.id === courseSlug),
    [programs, courseSlug],
  );

  useEffect(() => {
    if (!selectedProgram) return;
    if ((selectedProgram.batches?.length ?? 0) > 0) return;
    let cancelled = false;
    void getBatchesForCourse(selectedProgram.apiCourseId).then((res) => {
      if (cancelled || !res.ok || res.data == null) return;
      const rows = asRecordList(res.data);
      const extras: AdminBatchOption[] = rows.map((raw, idx) => ({
        batchId: Number(raw.id ?? raw.batchId ?? idx + 1),
        courseTitle: selectedProgram.title,
        courseSlug: selectedProgram.id,
        apiCourseId: selectedProgram.apiCourseId,
        mentorName:
          typeof raw.mentorName === "string"
            ? raw.mentorName
            : String(raw.mentor ?? "Faculty"),
        startDate:
          typeof raw.startDate === "string"
            ? raw.startDate
            : String(raw.startDate ?? ""),
        label: `${selectedProgram.title} · batch ${String(raw.id ?? raw.batchId ?? idx)}`,
      }));
      setBatchOptions((prev) => [
        ...prev.filter((o) => o.courseSlug !== selectedProgram.id),
        ...extras,
      ]);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedProgram]);

  const batchesForCourse = useMemo(() => {
    if (!courseSlug) return [];
    return batchOptions
      .filter((b) => b.courseSlug === courseSlug)
      .sort((a, b) => a.batchId - b.batchId);
  }, [batchOptions, courseSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bid = Number(batchId);
    if (!Number.isFinite(bid) || bid <= 0) {
      showToast({ type: "error", message: "Choose a batch." });
      return;
    }
    if (!title.trim()) {
      showToast({ type: "error", message: "Title is required." });
      return;
    }
    if (!startLocal) {
      showToast({ type: "error", message: "Pick a start date & time." });
      return;
    }
    if (durationMinutes < 15 || durationMinutes > 480) {
      showToast({
        type: "error",
        message: "Duration must be between 15 and 480 minutes.",
      });
      return;
    }
    const startIso = new Date(startLocal).toISOString();
    setSubmitting(true);
    const res = await createLiveSession({
      batchId: bid,
      title: title.trim(),
      startTime: startIso,
      durationMinutes,
      password: password.trim() || null,
      videoProvider: "Zoom",
    });
    setSubmitting(false);
    if (!res.ok) {
      showToast({ type: "error", message: res.message });
      return;
    }
    showToast({ type: "success", message: res.message });
    if (res.session) setCreated(res.session);
    else router.push("/admin/live-sessions");
  }

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast({ type: "success", message: `${label} copied` });
    } catch {
      showToast({ type: "error", message: "Copy failed" });
    }
  }

  return (
    <AdminAccessGate loginNextPath="/admin/live-sessions/new">
      <AdminPageHeader
        eyebrow="Scheduler"
        title="Schedule a live class"
        description="Creates a real Zoom meeting via the LA BIM API. Learners see join links for their enrolled batch. Start times are sent as UTC from your local date/time picker (see implementation guide)."
      />

      {created ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-lg shadow-slate-200/40 ring-1 ring-emerald-100 sm:mt-10 sm:rounded-3xl sm:p-8">
          <h2 className="font-display text-xl font-bold text-emerald-900">
            Meeting live on Zoom
          </h2>
          <p className="mt-2 text-sm font-medium text-emerald-800">{created.title}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {created.meetingUrl ? (
              <>
                <button
                  type="button"
                  onClick={() => void copy(created.meetingUrl, "Join URL")}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  Copy learner join
                </button>
                <a
                  href={created.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Open join URL
                </a>
              </>
            ) : null}
            {created.hostUrl ? (
              <button
                type="button"
                onClick={() => void copy(created.hostUrl!, "Host URL")}
                className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-900 hover:bg-violet-100"
              >
                Copy host start
              </button>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/live-sessions"
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-800"
            >
              Back to hub
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreated(null);
                setBatchId("");
                setTitle("");
                setStartLocal("");
                setPassword("");
              }}
              className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Schedule another
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="relative mx-auto mt-8 w-full max-w-xl sm:mt-10"
        >
          <div className="pointer-events-none absolute -inset-px rounded-[28px] bg-gradient-to-br from-cyan-500/40 via-transparent to-blue-600/30 opacity-70 blur-sm" />
          <div className="relative space-y-8 rounded-[26px] border border-slate-200 bg-white p-6 text-slate-900 shadow-xl shadow-slate-200/50 [color-scheme:light] sm:p-8">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Course
              </label>
              <select
                required
                disabled={catalogLoading}
                value={courseSlug}
                onChange={(e) => {
                  setCourseSlug(e.target.value);
                  setBatchId("");
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
              >
                <option value="">
                  {catalogLoading ? "Loading…" : "Select course"}
                </option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Batch cohort
              </label>
              <select
                required
                disabled={!courseSlug || batchesForCourse.length === 0}
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
              >
                <option value="">
                  {!courseSlug
                    ? "Pick a course first"
                    : batchesForCourse.length === 0
                      ? "Loading batches…"
                      : "Select batch"}
                </option>
                {batchesForCourse.map((b) => (
                  <option key={b.batchId} value={String(b.batchId)}>
                    #{b.batchId} · {b.mentorName} · {b.startDate?.slice(0, 10)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Session title
              </label>
              <input
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Week 4 — Clash detection clinic"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Start (local)
                </label>
                <input
                  required
                  type="datetime-local"
                  value={startLocal}
                  onChange={(e) => setStartLocal(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Duration (minutes)
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DURATION_PRESETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDurationMinutes(m)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                        durationMinutes === m
                          ? "bg-cyan-600 text-white shadow-sm"
                          : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={15}
                  max={480}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                />
                <p className="mt-1 text-[11px] text-slate-600">Allowed 15–480</p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Passcode (optional)
              </label>
              <input
                maxLength={50}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Video provider
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Zoom</p>
              <p className="mt-1 text-xs text-slate-600">
                Google Meet is not enabled on the API yet — leaving Zoom avoids runtime errors.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50"
              >
                {submitting ? "Creating…" : "Create Zoom meeting"}
              </button>
              <Link
                href="/admin/live-sessions"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      )}
    </AdminAccessGate>
  );
}
