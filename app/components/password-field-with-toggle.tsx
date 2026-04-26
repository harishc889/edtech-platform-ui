"use client";

import type { ChangeEvent } from "react";

export const authInputBase =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15";

export const authInputClass = `mt-2 ${authInputBase}`;
export const authLabelClass = "text-sm font-semibold text-slate-800";
export const authFieldMetaClass =
  "block text-xs font-bold uppercase tracking-wider text-slate-500";
export const authSelectClass =
  "w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15";
export const authTextareaClass = `${authInputBase} min-h-28 resize-y`;
export const authPrimaryButtonClass =
  "flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60";

const toggleButtonClass =
  "group absolute right-1.5 top-1/2 flex h-10 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-gradient-to-b from-white to-slate-50 text-slate-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/90 transition hover:to-cyan-50/80 hover:text-cyan-700 hover:ring-cyan-300/60 hover:shadow-[0_4px_14px_-4px_rgba(6,182,212,0.35)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500";

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg
        className="h-[1.35rem] w-[1.35rem] transition group-hover:scale-105"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.65}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
    );
  }
  return (
    <svg
      className="h-[1.35rem] w-[1.35rem] transition group-hover:scale-105"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.65}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

type Props = {
  label: string;
  name?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete: string;
  visible: boolean;
  onToggleVisible: () => void;
  error?: string | null;
  /** Screen reader label when hidden (default: "Show password") */
  ariaLabelShow?: string;
  /** Screen reader label when visible (default: "Hide password") */
  ariaLabelHide?: string;
};

export function PasswordFieldWithToggle({
  label,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  visible,
  onToggleVisible,
  error,
  ariaLabelShow = "Show password",
  ariaLabelHide = "Hide password",
}: Props) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <div className="relative mt-2">
        <input
          className={`${authInputBase} pr-4`}
          name={name}
          placeholder={placeholder}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        {/* <button
          type="button"
          onClick={onToggleVisible}
          className={toggleButtonClass}
          aria-label={visible ? ariaLabelHide : ariaLabelShow}
          aria-pressed={visible}
        >
          <EyeIcon visible={visible} />
        </button> */}
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </label>
  );
}
