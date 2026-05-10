import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-8 sm:pb-10">
      {eyebrow ? (
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-700">
          {eyebrow}
        </p>
      ) : null}
      <div className="mt-2 flex w-full flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 lg:gap-8">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex w-full shrink-0 flex-col items-stretch sm:ml-auto sm:w-auto sm:items-end sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
