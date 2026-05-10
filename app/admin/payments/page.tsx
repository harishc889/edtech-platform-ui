"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AdminAccessGate } from "@/app/components/admin/admin-access-gate";
import { AdminPageHeader } from "@/app/components/admin/admin-page-header";
import { getAdminPayments, getAdminUsers } from "@/lib/admin-service";
import type { AdminPaymentSummary, AdminUserSummary } from "@/lib/admin-types";
import { trimOrEmpty } from "@/lib/string-trim";

function PaymentsToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const userId = searchParams.get("userId") ?? "";
  const [users, setUsers] = useState<AdminUserSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    const loadUsers = async () => {
      const res = await getAdminUsers();
      if (cancelled || !res.ok) return;
      setUsers(res.data);
    };
    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  function push(next: { status?: string; userId?: string }) {
    const q = new URLSearchParams();
    const s = next.status !== undefined ? next.status : status;
    const u = next.userId !== undefined ? next.userId : userId;
    if (trimOrEmpty(s)) q.set("status", trimOrEmpty(s));
    if (trimOrEmpty(u)) q.set("userId", trimOrEmpty(u));
    const str = q.toString();
    router.push(str ? `/admin/payments?${str}` : "/admin/payments");
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-0 flex-1 sm:min-w-[160px]">
        <label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => push({ status: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 [color-scheme:light]"
        >
          <option value="">Any status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div className="min-w-0 flex-1 sm:min-w-[180px]">
        <label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
          User
        </label>
        <select
          value={userId}
          onChange={(e) => push({ userId: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 [color-scheme:light]"
        >
          <option value="">All users</option>
          {userId && !users.some((u) => String(u.id) === userId) ? (
            <option value={userId}>{`User #${userId}`}</option>
          ) : null}
          {users.map((u) => (
            <option key={u.id} value={String(u.id)}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="w-full shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:w-auto"
      >
        Refresh
      </button>
    </div>
  );
}

function PaymentsPageSkeleton() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Commerce"
        title="Payments"
        description="Operational ledger backed by GET /Admin/payments with optional status and userId query params. Extend columns when your DTO stabilizes (amount, gateway ids, course/batch labels)."
      />

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="h-11 max-w-3xl animate-pulse rounded-lg bg-slate-100" />
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
        <div className="mx-5 my-16 h-40 animate-pulse rounded-xl bg-slate-50" />
      </section>
    </>
  );
}

function AdminPaymentsContent() {
  const searchParams = useSearchParams();
  const status = useMemo(() => searchParams.get("status") ?? "", [searchParams]);
  const userId = useMemo(() => searchParams.get("userId") ?? "", [searchParams]);
  const [payments, setPayments] = useState<AdminPaymentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      const parsedUserId =
        trimOrEmpty(userId) && Number.isFinite(Number(userId))
          ? Number(userId)
          : undefined;

      const res = await getAdminPayments({
        status: trimOrEmpty(status) || undefined,
        userId: parsedUserId,
      });

      if (cancelled) return;

      if (!res.ok) {
        setPayments([]);
        setError(res.message || "Could not load payments.");
        setLoading(false);
        return;
      }

      setPayments(res.data);
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [status, userId]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Commerce"
        title="Payments"
        description="Operational ledger backed by GET /Admin/payments with optional status and userId query params. Extend columns when your DTO stabilizes (amount, gateway ids, course/batch labels)."
      />

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <PaymentsToolbar />
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Learner</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-sm text-slate-500">
                    Loading payments...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-sm text-rose-600">
                    {error}
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-sm text-slate-500">
                    No payment rows found for current filters.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{payment.orderId}</p>
                      <p className="mt-0.5 text-xs text-slate-500">#{payment.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{payment.user.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{payment.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-900">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
          Tip: deep-link from a user row with{" "}
          <Link href="/admin/payments?userId=1" className="font-semibold text-cyan-700 hover:underline">
            ?userId=
          </Link>
          .
        </div>
      </section>
    </>
  );
}

export default function AdminPaymentsPage() {
  return (
    <AdminAccessGate loginNextPath="/admin/payments">
      <Suspense fallback={<PaymentsPageSkeleton />}>
        <AdminPaymentsContent />
      </Suspense>
    </AdminAccessGate>
  );
}
