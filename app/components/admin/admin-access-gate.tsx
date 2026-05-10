"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { isAdminFromMePayload } from "@/lib/auth-role";

/** SSR-safe placeholder — must match what we render until client-only gate mounts. */
function AdminGateHydrateSkeleton() {
  return (
    <div className="flex min-h-[min(60vh,28rem)] w-full flex-col items-center justify-center gap-6 bg-slate-50 px-4 py-16">
      <div className="flex gap-2" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 animate-pulse rounded-full bg-cyan-500"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-slate-600">
        Verifying admin access…
      </p>
    </div>
  );
}

export function AdminAccessGate({
  children,
  loginNextPath = "/admin",
}: {
  children: React.ReactNode;
  loginNextPath?: string;
}) {
  const router = useRouter();
  const { status, mePayload } = useAuth();
  const admin = isAdminFromMePayload(mePayload);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(loginNextPath)}`);
    }
  }, [mounted, status, router, loginNextPath]);

  // Until mounted: SSR and first client pass render identical markup — avoids hydration mismatches
  // from auth/session timing vs Turbopack stale payloads.
  if (!mounted) {
    return <AdminGateHydrateSkeleton />;
  }

  if (status === "loading") {
    return <AdminGateHydrateSkeleton />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!admin) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-2xl shadow-slate-200/60 sm:px-8 sm:py-14">
        <div className="rounded-full bg-amber-50 p-4 ring-1 ring-amber-100">
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-amber-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
        <h1 className="font-display mt-6 text-2xl font-bold tracking-tight text-slate-900">
          Admin area restricted
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          This console is only available to academy administrators. Sign in with an
          account that has the Admin role, or return to your learner dashboard.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500"
          >
            Learner dashboard
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
