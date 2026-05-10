"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAccessGate } from "@/app/components/admin/admin-access-gate";
import { AdminPageHeader } from "@/app/components/admin/admin-page-header";
import { useToast } from "@/app/components/toast-provider";
import { buildAdminBatchOptions } from "@/lib/admin-batch-options";
import { getCachedPrograms } from "@/lib/client-course-cache";
import {
  deleteLiveSession,
  getLiveSessionsForBatch,
} from "@/lib/live-session-service";
import type { LiveSessionAdminView } from "@/lib/live-session-types";
import type { Program } from "@/lib/program-catalog";

function formatWhen(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

export default function AdminLiveSessionsHubPage() {
  const { showToast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [batchId, setBatchId] = useState<string>("");
  const [sessions, setSessions] = useState<LiveSessionAdminView[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const batchOptions = useMemo(
    () =>
      buildAdminBatchOptions(programs).sort((a, b) =>
        a.label.localeCompare(b.label),
      ),
    [programs],
  );

  useEffect(() => {
    let active = true;
    void getCachedPrograms()
      .then((rows) => {
        if (!active) return;
        setPrograms(rows);
      })
      .finally(() => {
        if (!active) return;
        setCatalogLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedBatchLabel = useMemo(() => {
    const id = Number(batchId);
    if (!Number.isFinite(id)) return null;
    return batchOptions.find((b) => b.batchId === id)?.label ?? null;
  }, [batchId, batchOptions]);

  const loadSessions = useCallback(async () => {
    const id = Number(batchId);
    if (!Number.isFinite(id) || id <= 0) {
      setSessions([]);
      return;
    }
    setSessionsLoading(true);
    const res = await getLiveSessionsForBatch(id);
    setSessionsLoading(false);
    if (!res.ok) {
      setSessions([]);
      showToast({ type: "error", message: res.message });
      return;
    }
    setSessions(res.sessions);
  }, [batchId, showToast]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  async function handleCopy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast({ type: "success", message: `${label} copied` });
    } catch {
      showToast({ type: "error", message: "Could not copy — try manually." });
    }
  }

  async function handleDelete(id: number, title: string) {
    const ok = window.confirm(
      `Remove scheduled meeting “${title}”? Learners will lose this join link.`,
    );
    if (!ok) return;
    setDeletingId(id);
    const res = await deleteLiveSession(id);
    setDeletingId(null);
    if (!res.ok) {
      showToast({ type: "error", message: res.message });
      return;
    }
    showToast({ type: "success", message: res.message });
    void loadSessions();
  }

  return (
    <AdminAccessGate loginNextPath="/admin/live-sessions">
      <AdminPageHeader
        eyebrow="Live operations"
        title="Session command centre"
        description="Review Zoom meetings per batch, share join and host links safely, and retire outdated sessions. Learners continue joining from their dashboard."
        actions={
          <Link
            href="/admin/live-sessions/new"
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-cyan-500 hover:to-blue-500"
          >
            <span aria-hidden className="text-[13px] font-bold leading-none">
              +
            </span>
            Schedule meeting
          </Link>
        }
      />

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 sm:rounded-3xl sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-4">
          <div className="min-w-0">
            <label
              htmlFor="batch-filter"
              className="text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Batch scope
            </label>
            <select
              id="batch-filter"
              disabled={catalogLoading}
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="mt-2 w-full max-w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none ring-cyan-500/30 transition focus:border-cyan-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
            >
              <option value="">
                {catalogLoading ? "Loading catalog…" : "Choose a batch…"}
              </option>
              {batchOptions.map((b) => (
                <option key={`${b.courseSlug}-${b.batchId}`} value={String(b.batchId)}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => void loadSessions()}
            disabled={!batchId || sessionsLoading}
            className="h-[42px] shrink-0 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-auto sm:self-end sm:px-5 sm:py-2.5"
          >
            Refresh list
          </button>
        </div>

        {selectedBatchLabel ? (
          <p className="mt-4 text-xs text-slate-500">
            Showing meetings for{" "}
            <span className="font-semibold text-slate-800">{selectedBatchLabel}</span>
          </p>
        ) : null}
      </section>

      <section className="mt-10">
        {!batchId ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm sm:rounded-3xl sm:py-24">
            <div className="rounded-full bg-cyan-50 p-5 ring-1 ring-cyan-100">
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10 text-cyan-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.125-7.5 11.25-7.5 11.25S4.5 17.625 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            </div>
            <h2 className="font-display mt-6 text-lg font-bold text-slate-900 sm:text-xl">
              Select a batch to load meetings
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              We scope sessions per cohort so you always see the exact Zoom links tied to
              that intake — matching how the API exposes{" "}
              <code className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-800">
                GET /LiveSession/batch/{"{"}batchId{"}"}
              </code>
              .
            </p>
          </div>
        ) : sessionsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-slate-200/80"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:rounded-3xl sm:px-8 sm:py-16">
            <p className="text-sm font-medium text-slate-600">
              No live meetings scheduled for this batch yet.
            </p>
            <Link
              href="/admin/live-sessions/new"
              className="mt-6 inline-flex rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-cyan-500 hover:to-blue-500"
            >
              Schedule first session →
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 sm:rounded-3xl">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4 font-semibold">Session</th>
                    <th className="hidden px-5 py-4 font-semibold md:table-cell">
                      When
                    </th>
                    <th className="hidden px-5 py-4 font-semibold lg:table-cell">
                      Provider
                    </th>
                    <th className="px-5 py-4 font-semibold">Links</th>
                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((row) => (
                    <tr
                      key={row.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-5 align-top">
                        <p className="font-semibold text-slate-900">{row.title}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          ID {row.id}
                          {row.meetingId ? ` · Meeting ${row.meetingId}` : ""}
                        </p>
                        <p className="mt-2 text-xs text-slate-600 md:hidden">
                          {formatWhen(row.startTime)} · {row.durationMinutes} min
                        </p>
                      </td>
                      <td className="hidden px-5 py-5 align-top text-slate-800 md:table-cell">
                        <p>{formatWhen(row.startTime)}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {row.durationMinutes} minutes
                        </p>
                      </td>
                      <td className="hidden px-5 py-5 align-top lg:table-cell">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-100">
                          {row.provider}
                        </span>
                      </td>
                      <td className="px-5 py-5 align-top">
                        <div className="flex flex-wrap gap-2">
                          {row.meetingUrl ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  void handleCopy(row.meetingUrl, "Learner join URL")
                                }
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-cyan-800 transition hover:bg-cyan-50"
                              >
                                Copy join
                              </button>
                              <a
                                href={row.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:from-cyan-500 hover:to-blue-500"
                              >
                                Open
                              </a>
                            </>
                          ) : (
                            <span className="text-xs text-slate-500">No URL</span>
                          )}
                          {row.hostUrl ? (
                            <button
                              type="button"
                              onClick={() =>
                                void handleCopy(row.hostUrl!, "Host start URL")
                              }
                              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-bold text-violet-900 transition hover:bg-violet-100"
                            >
                              Copy host
                            </button>
                          ) : null}
                        </div>
                        {row.password ? (
                          <p className="mt-2 text-[11px] text-slate-500">
                            Passcode:{" "}
                            <button
                              type="button"
                              className="font-mono text-slate-800 underline-offset-2 hover:underline"
                              onClick={() =>
                                void handleCopy(row.password!, "Passcode")
                              }
                            >
                              {row.password}
                            </button>
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-5 text-right align-top">
                        <button
                          type="button"
                          disabled={deletingId === row.id}
                          onClick={() => void handleDelete(row.id, row.title)}
                          className="rounded-full border border-red-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                        >
                          {deletingId === row.id ? "…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </AdminAccessGate>
  );
}
