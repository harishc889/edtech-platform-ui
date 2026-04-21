"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { resetPassword } from "@/lib/auth-service";
import {
  PasswordFieldWithToggle,
  authPrimaryButtonClass,
} from "@/app/components/password-field-with-toggle";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token")?.trim() ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(
    null,
  );
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    let hasError = false;
    setNewPasswordError(null);
    setConfirmPasswordError(null);

    if (!token) {
      setStatus("Invalid reset link. Please request a new password reset email.");
      setIsError(true);
      hasError = true;
    }
    if (!newPassword) {
      setNewPasswordError("New password is required.");
      hasError = true;
    } else if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters.");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your new password.");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    }

    return !hasError;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    setIsError(false);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await resetPassword(token, newPassword);
      if (!response.ok) {
        setIsError(true);
        setStatus(
          response.error?.message ??
            "Could not reset password. The link may be invalid or expired.",
        );
        return;
      }

      setIsError(false);
      setStatus(
        response.data?.message ??
          "Password reset successful. You can now login with your new password.",
      );
      setNewPassword("");
      setConfirmPassword("");
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
              Reset password
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Enter your new password to complete recovery.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <PasswordFieldWithToggle
              label="New password"
              placeholder="Enter new password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setNewPasswordError(null);
                setStatus(null);
              }}
              visible={showNewPassword}
              onToggleVisible={() => setShowNewPassword((v) => !v)}
              error={newPasswordError}
            />

            <PasswordFieldWithToggle
              label="Confirm password"
              placeholder="Re-enter new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(null);
                setStatus(null);
              }}
              visible={showConfirmPassword}
              onToggleVisible={() => setShowConfirmPassword((v) => !v)}
              error={confirmPasswordError}
            />

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
              disabled={isSubmitting || !token}
              className={authPrimaryButtonClass}
            >
              {isSubmitting ? "Updating..." : "Reset password"}
            </button>

            <p className="text-center text-sm text-slate-600">
              <Link href="/login" className="font-bold text-cyan-700 hover:text-cyan-600">
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
