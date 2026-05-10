"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAccessGate } from "@/app/components/admin/admin-access-gate";
import { AdminPageHeader } from "@/app/components/admin/admin-page-header";
import { useToast } from "@/app/components/toast-provider";
import { getAdminUserById, patchAdminUserRole } from "@/lib/admin-service";
import type { AdminRole, AdminUserSummary } from "@/lib/admin-types";
import { trimOrEmpty } from "@/lib/string-trim";

const DEFAULT_ASSIGNABLE_ROLES: AdminRole[] = ["Admin", "User"];

function roleSelectOptions(current?: AdminRole): AdminRole[] {
  const r = current != null ? trimOrEmpty(String(current)) : "";
  if (!r) return [...DEFAULT_ASSIGNABLE_ROLES];
  const defaults = new Set(DEFAULT_ASSIGNABLE_ROLES.map(String));
  if (!defaults.has(r)) return [r as AdminRole, ...DEFAULT_ASSIGNABLE_ROLES];
  return [...DEFAULT_ASSIGNABLE_ROLES];
}

function formatCreatedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const rawId = params?.id;
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId;
  const userId = useMemo(() => {
    const n = Number(idStr);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [idStr]);

  const [user, setUser] = useState<AdminUserSummary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<AdminRole>("User");
  const [saving, setSaving] = useState(false);

  const loadUser = useCallback(async () => {
    if (userId == null) {
      setLoading(false);
      setLoadError("Invalid user id.");
      setUser(null);
      return;
    }
    setLoading(true);
    setLoadError(null);
    const res = await getAdminUserById(userId);
    if (!res.ok) {
      setUser(null);
      setLoadError(res.message || "Could not load user.");
      setLoading(false);
      return;
    }
    setUser(res.data);
    setSelectedRole(res.data.role);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUser();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadUser]);

  const roleOptions = useMemo(
    () => roleSelectOptions(user?.role),
    [user?.role],
  );

  const roleDirty =
    user != null &&
    trimOrEmpty(String(selectedRole)) !== trimOrEmpty(String(user.role));

  async function handleSaveRole() {
    if (userId == null || user == null || saving || !roleDirty) return;
    setSaving(true);
    const res = await patchAdminUserRole(userId, {
      role: trimOrEmpty(String(selectedRole)),
    });
    setSaving(false);
    if (!res.ok) {
      showToast({ type: "error", message: res.message });
      return;
    }
    setUser((prev) =>
      prev ? { ...prev, role: res.data.role } : prev,
    );
    setSelectedRole(res.data.role);
    showToast({ type: "success", message: "Role updated." });
    router.refresh();
  }

  const title =
    trimOrEmpty(user?.name) || (userId != null ? `User #${userId}` : "User");

  return (
    <AdminAccessGate loginNextPath={`/admin/users/${idStr ?? ""}`}>
      <AdminPageHeader
        eyebrow="People & access"
        title={loading ? `User #${idStr ?? "—"}` : title}
        description="Review this learner’s profile and change their platform role when needed. Changes apply immediately for permissions across the academy."
        actions={
          <Link
            href="/admin/users"
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← All users
          </Link>
        }
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-display text-base font-bold text-slate-900">
            Profile
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Contact details and account metadata from your directory.
          </p>

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Loading profile…</p>
          ) : loadError ? (
            <p className="mt-6 text-sm text-rose-600">{loadError}</p>
          ) : user ? (
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Name
                </dt>
                <dd className="mt-1 text-slate-900">{user.name}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </dt>
                <dd className="mt-1 text-slate-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Record id
                </dt>
                <dd className="mt-1 font-mono text-slate-900">{user.id}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Current role
                </dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {user.role}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Created
                </dt>
                <dd className="mt-1 font-mono text-xs text-slate-700">
                  {formatCreatedAt(user.createdAt)}
                </dd>
              </div>
            </dl>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-bold text-slate-900">
            Update role
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Choose Admin or User, then save. Only administrators should grant admin access.
          </p>

          {!loading && !loadError && user ? (
            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="admin-user-role"
                  className="text-[11px] font-bold uppercase tracking-wide text-slate-600"
                >
                  Role
                </label>
                <select
                  id="admin-user-role"
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value as AdminRole)
                  }
                  disabled={saving}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 [color-scheme:light]"
                >
                  {roleOptions.map((r) => (
                    <option key={String(r)} value={String(r)}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                disabled={saving || !roleDirty}
                onClick={() => void handleSaveRole()}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save role"}
              </button>
            </div>
          ) : loading ? (
            <p className="mt-6 text-sm text-slate-500">Loading…</p>
          ) : (
            <p className="mt-6 text-sm text-slate-500">
              Load a valid user to edit role.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <h2 className="font-display text-base font-bold text-slate-900">
            Danger zone
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Role changes are enforced server-side. Keep destructive actions behind
            confirmations elsewhere — UI gates are not security.
          </p>
        </section>
      </div>
    </AdminAccessGate>
  );
}
