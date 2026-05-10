"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/app/components/admin/admin-access-gate";
import { AdminPageHeader } from "@/app/components/admin/admin-page-header";
import {
  getAdminAnalyticsEnrollments,
  getAdminAnalyticsRevenue,
  getAdminDashboard,
} from "@/lib/admin-service";
import type {
  AdminDashboardResponse,
  AdminEnrollmentAnalyticsResponse,
  AdminRevenueAnalyticsResponse,
} from "@/lib/admin-types";
import { formatInrWhole } from "@/lib/display-format";

const destinations = [
  {
    href: "/admin/live-sessions",
    title: "Live sessions",
    body: "Batch-scoped Zoom meetings — list, links, delete.",
    api: "LiveSession + Admin ops",
  },
  {
    href: "/admin/users",
    title: "Users",
    body: "Directory, detail, and role updates.",
    api: "GET/PATCH /Admin/users…",
  },
  {
    href: "/admin/payments",
    title: "Payments",
    body: "Filter by status or learner.",
    api: "GET /Admin/payments",
  },
  {
    href: "/admin/analytics",
    title: "Analytics",
    body: "Enrollments and revenue trends.",
    api: "GET /Admin/analytics/*",
  },
] as const;

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminDashboardResponse | null>(null);
  const [enrollmentAnalytics, setEnrollmentAnalytics] =
    useState<AdminEnrollmentAnalyticsResponse | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] =
    useState<AdminRevenueAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [dash, enrollRes, revenueRes] = await Promise.all([
        getAdminDashboard(),
        getAdminAnalyticsEnrollments(),
        getAdminAnalyticsRevenue(6),
      ]);
      if (cancelled) return;
      if (dash.ok) setMetrics(dash.data);
      if (enrollRes.ok) setEnrollmentAnalytics(enrollRes.data);
      else setEnrollmentAnalytics(null);
      if (revenueRes.ok) setRevenueAnalytics(revenueRes.data);
      else setRevenueAnalytics(null);
      setLoading(false);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const enrollmentSum =
    enrollmentAnalytics !== null
      ? Object.values(enrollmentAnalytics).reduce((a, b) => a + b, 0)
      : null;
  const enrollmentBatchCount =
    enrollmentAnalytics !== null ? Object.keys(enrollmentAnalytics).length : null;
  const revenueSixMonthTotal =
    revenueAnalytics !== null
      ? Object.values(revenueAnalytics).reduce((a, b) => a + b, 0)
      : null;

  return (
    <AdminAccessGate loginNextPath="/admin">
      <AdminPageHeader
        eyebrow="Overview"
        title="Operations dashboard"
        description="Central entry for academy administration. Snapshot below combines GET /Admin/dashboard with enrollment and revenue analytics (same sources as the Analytics workspace)."
      />

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {destinations.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 transition hover:border-cyan-200 hover:shadow-md"
          >
            <p className="font-display text-lg font-bold text-slate-900 group-hover:text-cyan-800">
              {d.title}
            </p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              {d.body}
            </p>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {d.api}
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-lg font-bold text-slate-900">
          Dashboard snapshot
        </h2>
        {loading ? (
          <p className="mt-2 text-sm text-slate-600">Loading metrics...</p>
        ) : metrics ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Users</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{metrics.totalUsers}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Courses</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{metrics.totalCourses}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Revenue</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{metrics.totalRevenue}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Active sessions</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{metrics.activeSessions}</p>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-600">Dashboard metrics unavailable.</p>
        )}
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Analytics preview
          </h2>
          <Link
            href="/admin/analytics"
            className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
          >
            Open analytics →
          </Link>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Totals from GET /Admin/analytics/enrollments and GET /Admin/analytics/revenue (last 6 months).
        </p>
        {loading ? (
          <p className="mt-4 text-sm text-slate-600">Loading analytics…</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Enrollments (analytics API)
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {enrollmentSum !== null ? enrollmentSum : "—"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {enrollmentBatchCount !== null
                  ? `${enrollmentBatchCount} batch${enrollmentBatchCount === 1 ? "" : "es"} in breakdown`
                  : "Unavailable"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Revenue (6 months)
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {revenueSixMonthTotal !== null
                  ? formatInrWhole(revenueSixMonthTotal)
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Matches dashboard Analytics revenue tab (default window).
              </p>
            </div>
          </div>
        )}
      </section>
    </AdminAccessGate>
  );
}
