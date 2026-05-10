"use client";

import { useState } from "react";
import { AdminAccessGate } from "@/app/components/admin/admin-access-gate";
import { AdminPageHeader } from "@/app/components/admin/admin-page-header";

type TabId = "enrollments" | "revenue";

export default function AdminAnalyticsPage() {
  const [tab, setTab] = useState<TabId>("enrollments");
  const [months, setMonths] = useState(6);

  return (
    <AdminAccessGate loginNextPath="/admin/analytics">
      <AdminPageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Enrollments overview (GET /Admin/analytics/enrollments) and revenue series (GET /Admin/analytics/revenue?months=). Swap the placeholder below for charts when metrics contracts land."
      />

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
          <p className="text-xs text-slate-600">
            Pass <code className="rounded bg-slate-100 px-1">months={months}</code> into{" "}
            <code className="rounded bg-slate-100 px-1">getAdminAnalyticsRevenue()</code>.
          </p>
        </div>
      ) : null}

      <section className="mt-10 flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
        <p className="font-display text-lg font-bold text-slate-900">
          {tab === "enrollments" ? "Enrollment funnel & cohort charts" : "Revenue trend"}
        </p>
        <p className="mt-2 max-w-lg text-sm text-slate-600">
          {tab === "enrollments"
            ? "Mount a chart library here using GET /Admin/analytics/enrollments."
            : "Mount time-series using GET /Admin/analytics/revenue with the months control above."}
        </p>
      </section>
    </AdminAccessGate>
  );
}
