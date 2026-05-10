"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AdminAccessGate } from "@/app/components/admin/admin-access-gate";
import { AdminPageHeader } from "@/app/components/admin/admin-page-header";
import { getAdminUsers } from "@/lib/admin-service";
import type { AdminUserSummary } from "@/lib/admin-types";

function UsersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? "";

  return (
    <div className="flex w-full max-w-full flex-wrap items-center justify-start gap-2 rounded-xl border border-slate-200 bg-white p-1.5 sm:ml-auto sm:w-fit sm:justify-end">
      <Link
        href="/admin/users"
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
          !role
            ? "bg-cyan-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        All roles
      </Link>
      <Link
        href="/admin/users?role=Admin"
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
          role.toLowerCase() === "admin"
            ? "bg-cyan-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        Admin
      </Link>
      <Link
        href="/admin/users?role=User"
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
          role.toLowerCase() === "user"
            ? "bg-cyan-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        User
      </Link>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        Refresh
      </button>
    </div>
  );
}

function UsersPageSkeleton() {
  return (
    <>
      <AdminPageHeader
        eyebrow="People & access"
        title="Users"
        description="Directory backed by GET /Admin/users?role=. Row actions open learner detail (GET /Admin/users/{id}) where you can PATCH role via /Admin/users/{id}/role."
        actions={<div className="h-10 w-full max-w-xs animate-pulse rounded-xl bg-slate-200" />}
      />

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
        <div className="mx-5 my-16 h-48 animate-pulse rounded-xl bg-slate-50" />
      </section>
    </>
  );
}

function AdminUsersContent() {
  const searchParams = useSearchParams();
  const role = useMemo(() => searchParams.get("role") ?? "", [searchParams]);
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      const res = await getAdminUsers(role ? { role } : undefined);

      if (cancelled) return;

      if (!res.ok) {
        setUsers([]);
        setError(res.message || "Could not load users.");
        setLoading(false);
        return;
      }

      setUsers(res.data);
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [role]);

  return (
    <>
      <AdminPageHeader
        eyebrow="People & access"
        title="Users"
        description="Directory backed by GET /Admin/users?role=. Row actions open learner detail (GET /Admin/users/{id}) where you can PATCH role via /Admin/users/{id}/role."
        actions={<UsersFilters />}
      />

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-semibold text-slate-800">User directory</p>
          <p className="mt-1 text-xs text-slate-500">
            Backed by{" "}
            <code className="rounded bg-slate-50 px-1 py-0.5 text-[11px]">
              getAdminUsers()
            </code>
            .
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border-b border-slate-50">
                  <td colSpan={4} className="px-5 py-16 text-center text-sm text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : error ? (
                <tr className="border-b border-slate-50">
                  <td colSpan={4} className="px-5 py-16 text-center text-sm text-rose-600">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr className="border-b border-slate-50">
                  <td colSpan={4} className="px-5 py-16 text-center text-sm text-slate-500">
                    No users found for this role.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={`${user.id}-${user.email}`} className="border-b border-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-5 py-4 text-slate-700">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {user.id > 0 ? (
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="font-semibold text-cyan-700 underline-offset-2 hover:underline"
                        >
                          Open
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminAccessGate loginNextPath="/admin/users">
      <Suspense fallback={<UsersPageSkeleton />}>
        <AdminUsersContent />
      </Suspense>
    </AdminAccessGate>
  );
}
