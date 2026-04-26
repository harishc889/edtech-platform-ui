"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { forgotPassword } from "@/lib/auth-service";
import {
  authInputClass,
  authLabelClass,
  authPrimaryButtonClass,
} from "@/app/components/password-field-with-toggle";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(nextEmail: string) {
    if (!nextEmail) {
      setEmailError("Email is required.");
      return false;
    }
    if (!isValidEmail(nextEmail)) {
      setEmailError("Enter a valid email address.");
      return false;
    }

    setEmailError(null);
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    setIsError(false);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const nextEmail = (formData.get("email")?.toString() ?? email).trim();
    setEmail(nextEmail);

    if (!validate(nextEmail)) return;

    setIsSubmitting(true);
    try {
      const response = await forgotPassword(nextEmail);
      if (!response.ok) {
        setIsError(true);
        setStatus(
          response.error?.message ?? "Could not process request. Please try again.",
        );
        return;
      }

      setIsError(false);
      setStatus(
        response.data?.message ??
          "If an account exists for this email, a reset link has been sent.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto flex w-full max-w-md items-center">
        <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
          <div className="text-center">
            <p className="inline-flex rounded-full bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800">
              Account recovery
            </p>
            <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900">
              Forgot password
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Enter your registered email and we will send a reset link.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className={authLabelClass}>Email</span>
              <input
                name="email"
                className={authInputClass}
                placeholder="Email ID"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                  setStatus(null);
                  setIsError(false);
                }}
                autoComplete="email"
                inputMode="email"
              />
              {emailError ? (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              ) : null}
            </label>

            {status ? (
              <p
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  isError
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-green-200 bg-green-50 text-green-800"
                }`}
              >
                {status}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className={authPrimaryButtonClass}
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>

            <p className="text-center text-sm text-slate-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-bold text-cyan-700 hover:text-cyan-600"
              >
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
