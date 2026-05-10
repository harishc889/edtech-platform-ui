"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  ADMIN_NAV_SECTIONS,
  adminNavActiveHref,
} from "@/lib/admin-nav-config";

function BrandLockup() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-3 rounded-xl py-1 transition hover:opacity-90"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 text-lg font-black text-white shadow-md shadow-cyan-500/25">
        LA
      </span>
      <div className="min-w-0">
        <p className="font-display truncate text-sm font-bold tracking-tight text-slate-900">
          LA BIM Academy
        </p>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700">
          Admin console
        </p>
      </div>
    </Link>
  );
}

/** Short sidebar footer — avoids endpoint-heavy copy in the shell */
function SidebarHints() {
  return (
    <div className="mt-auto shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Console areas
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        Overview, live sessions, learners & roles, payments, and analytics — each section opens its own workspace in this shell.
      </p>
    </div>
  );
}

function AdminNavSections({
  itemClasses,
  headingPxClass,
}: {
  itemClasses: (href: string) => string;
  headingPxClass: string;
}) {
  return (
    <>
      {ADMIN_NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <p
            className={`${headingPxClass} text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400`}
          >
            {section.title}
          </p>
          <div className="mt-2 flex flex-col gap-1">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                title={item.description ?? undefined}
                className={`rounded-lg px-3 py-1.5 transition ${itemClasses(item.href)}`}
              >
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Single `<aside>`; nav is rendered once. The mobile strip (← Site / badge) is hidden from `lg`
 * up via `globals.css` (`.admin-shell-mobile-strip`) so it cannot resurrect when Tailwind utility
 * order shifts during HMR.
 */
function AdminChromeInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeHref = adminNavActiveHref(pathname);

  function itemClasses(href: string) {
    const active = activeHref === href;
    return active
      ? "border border-cyan-200 bg-cyan-50 text-slate-900 shadow-sm"
      : "group border border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900";
  }

  return (
    <div
      data-admin-shell
      className="relative flex min-h-0 w-full flex-1 flex-col overflow-x-hidden bg-slate-50 text-slate-900"
    >
      <div className="admin-shell-row relative mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col gap-0 lg:flex-row lg:flex-nowrap lg:items-stretch lg:gap-8">
        <aside className="admin-shell-sidebar flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:w-72 lg:self-stretch lg:border-b-0 lg:border-r xl:w-80">
          <div className="admin-shell-mobile-strip shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <Link
              href="/"
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 font-display text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              ← Site
            </Link>
            <span className="inline-flex shrink-0 items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-800">
              Admin
            </span>
          </div>

          <div className="flex max-h-[min(26rem,56vh)] min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-5 py-6 lg:max-h-none lg:py-8 xl:px-6 xl:py-10">
            <BrandLockup />
            <nav className="flex min-h-0 flex-1 flex-col gap-6 border-t border-slate-100 pt-6 lg:pt-8">
              <AdminNavSections
                itemClasses={itemClasses}
                headingPxClass="px-1 lg:px-4"
              />
            </nav>
            <SidebarHints />
          </div>
        </aside>

        <main className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden bg-slate-50 px-4 py-6 sm:px-6 lg:overflow-visible lg:py-10 lg:pl-4 lg:pr-10">
          <div className="mx-auto w-full max-w-6xl pb-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminChrome({ children }: { children: ReactNode }) {
  return <AdminChromeInner>{children}</AdminChromeInner>;
}
