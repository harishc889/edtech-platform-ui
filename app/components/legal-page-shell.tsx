import Link from "next/link";
import BackNavLink from "./back-nav-link";

type LegalPageShellProps = {
  badge: string;
  title: string;
  description: string;
  maxWidth?: "3xl" | "5xl";
  children?: React.ReactNode;
};

export function LegalPageShell({
  badge,
  title,
  description,
  maxWidth = "3xl",
  children,
}: LegalPageShellProps) {
  const widthClass = maxWidth === "5xl" ? "max-w-5xl" : "max-w-3xl";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className={`mx-auto w-full ${widthClass}`}>
      <nav className="mb-8 text-sm">
        <BackNavLink className="font-semibold text-cyan-700 transition hover:text-cyan-600" />
      </nav>

        <section className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-200/40 sm:p-10">
          <p className="inline-flex rounded-full bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800">
            {badge}
          </p>
          <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {description}
          </p>
          {children ? <div className="mt-8">{children}</div> : null}
        </section>
      </div>
    </main>
  );
}
