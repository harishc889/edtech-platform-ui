"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingEnquiryCta() {
  const pathname = usePathname();
  const hideOn = ["/contact", "/login", "/register"];
  if (hideOn.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <>
      <Link
        href="/contact"
        aria-label="Send enquiry"
        className="group fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 overflow-hidden rounded-l-2xl border border-cyan-500/40 bg-gradient-to-b from-cyan-600 to-blue-700 px-2 py-4 text-white shadow-2xl shadow-cyan-600/25 transition hover:from-cyan-500 hover:to-blue-600 lg:block"
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-white/30" aria-hidden />
        <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-extrabold uppercase tracking-[0.22em]">
          Send Enquiry
        </span>
      </Link>

      <Link
        href="/contact"
        aria-label="Send enquiry"
        className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-600 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-cyan-600/25 transition hover:from-cyan-500 hover:to-blue-600 lg:hidden"
      >
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-200/90" />
        <span>Send Enquiry</span>
      </Link>
    </>
  );
}
