"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAccessGate } from "@/app/components/admin/admin-access-gate";
import { AdminPageHeader } from "@/app/components/admin/admin-page-header";
import {
  getAdminAnalyticsEnrollments,
  getAdminAnalyticsRevenue,
} from "@/lib/admin-service";
import type {
  AdminEnrollmentAnalyticsResponse,
  AdminRevenueAnalyticsResponse,
} from "@/lib/admin-types";
import { formatInrWhole } from "@/lib/display-format";

type TabId = "enrollments" | "revenue";

function enrollmentRows(data: AdminEnrollmentAnalyticsResponse): [string, number][] {
  return Object.entries(data).sort((a, b) => b[1] - a[1]);
}

function revenueRowsSorted(data: AdminRevenueAnalyticsResponse): [string, number][] {
  return Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
}

export default function AdminAnalyticsPage() {
  const [tab, setTab] = useState<TabId>("enrollments");
  const [months, setMonths] = useState(6);

  const [enrollmentData, setEnrollmentData] =
    useState<AdminEnrollmentAnalyticsResponse | null>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  const [revenueData, setRevenueData] =
    useState<AdminRevenueAnalyticsResponse | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueError, setRevenueError] = useState<string | null>(null);

  const loadEnrollments = useCallback(async () => {
    setEnrollmentLoading(true);
    setEnrollmentError(null);
    const res = await getAdminAnalyticsEnrollments();
    if (!res.ok) {
      setEnrollmentError(res.message);
      setEnrollmentData(null);
    } else {
      setEnrollmentData(res.data);
    }
    setEnrollmentLoading(false);
  }, []);

  const loadRevenue = useCallback(async () => {
    setRevenueLoading(true);
    setRevenueError(null);
    const res = await getAdminAnalyticsRevenue(months);
    if (!res.ok) {
      setRevenueError(res.message);
      setRevenueData(null);
    } else {
      setRevenueData(res.data);
    }
    setRevenueLoading(false);
  }, [months]);

  useEffect(() => {
    if (tab !== "enrollments") return;
    void loadEnrollments();
  }, [tab, loadEnrollments]);

  useEffect(() => {
    if (tab !== "revenue") return;
    void loadRevenue();
  }, [tab, months, loadRevenue]);

  const enrollmentSorted = useMemo(
    () => (enrollmentData ? enrollmentRows(enrollmentData) : []),
    [enrollmentData],
  );
  const enrollmentMax = useMemo(
    () => enrollmentSorted.reduce((m, [, v]) => Math.max(m, v), 0),
    [enrollmentSorted],
  );
  const enrollmentTotal = useMemo(
    () => enrollmentSorted.reduce((s, [, v]) => s + v, 0),
    [enrollmentSorted],
  );

  const revenueSorted = useMemo(
    () => (revenueData ? revenueRowsSorted(revenueData) : []),
    [revenueData],
  );
  const revenueMax = useMemo(
    () => revenueSorted.reduce((m, [, v]) => Math.max(m, v), 0),
    [revenueSorted],
  );
  const revenueTotal = useMemo(
    () => revenueSorted.reduce((s, [, v]) => s + v, 0),
    [revenueSorted],
  );

  return (
    <AdminAccessGate loginNextPath="/admin/analytics">
      <AdminPageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Enrollment counts per batch from GET /Admin/analytics/enrollments, and monthly revenue from GET /Admin/analytics/revenue."
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href="/admin"
          className="text-sm font-medium text-cyan-700 hover:text-cyan-900"
        >
          ← Operations dashboard
        </Link>
      </div>

      <div className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("enrollments")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
            tab === "enrollments"
              ? "bg-cyan-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Enrollments
        </button>
        <button
          type="button"
          onClick={() => setTab("revenue")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
            tab === "revenue"
              ? "bg-cyan-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Revenue
        </button>
      </div>

      {tab === "revenue" ? (
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
              Months
            </span>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 [color-scheme:light]"
            >
              {[3, 6, 12, 24].map((m) => (
                <option key={m} value={m}>
                  {m} months
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void loadRevenue()}
            disabled={revenueLoading}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <button
            type="button"
            onClick={() => void loadEnrollments()}
            disabled={enrollmentLoading}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      )}

      {tab === "enrollments" ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {enrollmentError ? (
            <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
              {enrollmentError}
            </div>
          ) : null}
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 px-4 py-4">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Enrollments by batch
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Keys are batch identifiers from the API; values are enrollment counts.
              </p>
            </div>
            {enrollmentLoading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : enrollmentData && enrollmentSorted.length > 0 ? (
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{enrollmentTotal}</span>{" "}
                enrollments across{" "}
                <span className="font-semibold text-slate-900">
                  {enrollmentSorted.length}
                </span>{" "}
                batches
              </p>
            ) : null}
          </div>

          {enrollmentLoading && !enrollmentData ? (
            <div className="flex min-h-[200px] items-center justify-center px-4 py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-600" />
            </div>
          ) : enrollmentSorted.length === 0 && !enrollmentLoading ? (
            <div className="px-4 py-12 text-center text-sm text-slate-600">
              No enrollment analytics returned yet.
            </div>
          ) : (
            <div className="overflow-x-auto px-2 pb-4 pt-2">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Batch
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Count
                    </th>
                    <th scope="col" className="hidden min-w-[140px] px-3 py-2 font-semibold sm:table-cell">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrollmentSorted.map(([batchId, count]) => (
                    <tr
                      key={batchId}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80"
                    >
                      <td className="max-w-[200px] truncate px-3 py-2 font-medium text-slate-900">
                        {batchId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 tabular-nums text-slate-800">
                        {count}
                      </td>
                      <td className="hidden px-3 py-2 sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-2 min-w-[72px] flex-1 rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full bg-cyan-600"
                              style={{
                                width: `${enrollmentMax ? Math.round((count / enrollmentMax) * 100) : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {revenueError ? (
            <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
              {revenueError}
            </div>
          ) : null}
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 px-4 py-4">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Revenue by month
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Rolling window from the API (<code className="rounded bg-slate-100 px-1">months={months}</code>
                ).
              </p>
            </div>
            {revenueLoading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : revenueSorted.length > 0 ? (
              <p className="text-sm text-slate-600">
                Total{" "}
                <span className="font-semibold text-slate-900">
                  {formatInrWhole(revenueTotal)}
                </span>
              </p>
            ) : null}
          </div>

          {revenueLoading && !revenueData ? (
            <div className="flex min-h-[200px] items-center justify-center px-4 py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-600" />
            </div>
          ) : revenueSorted.length === 0 && !revenueLoading ? (
            <div className="px-4 py-12 text-center text-sm text-slate-600">
              No revenue series returned for this range.
            </div>
          ) : (
            <div className="overflow-x-auto px-2 pb-4 pt-2">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Month
                    </th>
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Revenue
                    </th>
                    <th scope="col" className="hidden min-w-[140px] px-3 py-2 font-semibold sm:table-cell">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {revenueSorted.map(([monthKey, amount]) => (
                    <tr
                      key={monthKey}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80"
                    >
                      <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
                        {monthKey}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 tabular-nums text-slate-800">
                        {formatInrWhole(amount)}
                      </td>
                      <td className="hidden px-3 py-2 sm:table-cell">
                        <div className="h-2 min-w-[72px] flex-1 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-emerald-600"
                            style={{
                              width: `${revenueMax ? Math.round((amount / revenueMax) * 100) : 0}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </AdminAccessGate>
  );
}
