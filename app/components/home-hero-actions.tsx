import Link from "next/link";

export default function HomeHeroActions() {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
      <Link
        href="/courses"
        className="h-16 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-400/40 sm:text-base"
      >
        Explore courses
      </Link>
      <Link
        href="/enroll"
        className="h-16 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 sm:text-base"
      >
        Enroll now
      </Link>
    </div>
  );
}
