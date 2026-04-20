"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { login } from "@/lib/auth-service";
import {
  PasswordFieldWithToggle,
  authInputClass,
  authLabelClass,
  authPrimaryButtonClass,
} from "@/app/components/password-field-with-toggle";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextEmail = email.trim();
    const nextPassword = password;

    const nextEmailError = nextEmail ? null : "Email is required.";
    const nextPasswordError = nextPassword ? null : "Password is required.";

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(null);

    return !nextEmailError && !nextPasswordError;
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await login(email, password);

      if (!response.ok) {
        setFormError(response.error?.message ?? "Invalid email or password.");
        return;
      }

      const nextPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      const redirectTo =
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/dashboard";
      window.dispatchEvent(new Event("auth:changed"));
      router.push(redirectTo);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-mesh px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
        <section className="hidden lg:flex">
          <div className="relative flex w-full flex-col justify-center overflow-hidden rounded-3xl border border-slate-700/80 bg-mesh-dark p-12 text-white shadow-2xl">
            <div
              className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
              aria-hidden
            />
            <p className="relative inline-flex w-fit rounded-full border border-cyan-400/40 bg-cyan-950/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-50">
              Welcome back
            </p>
            <h1 className="font-display relative mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white">
              Sign in to your learning dashboard
            </h1>
            <p className="relative mt-4 max-w-md text-base leading-relaxed text-slate-200">
              Track progress, join live classes, and keep your learning streak
              going.
            </p>
            <div className="relative mt-10 rounded-2xl border border-white/20 bg-slate-900/40 p-6 backdrop-blur-sm">
              <p className="text-sm font-bold text-white">Secure authentication</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                We keep your session active and protect your account with secure
                token handling.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-md items-center lg:max-w-none lg:py-4">
          <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
            <div className="text-center lg:text-left">
              <p className="inline-flex rounded-full bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800">
                Secure login
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900">
                Login
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Use your email and password to continue.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <label className="block">
                <span className={authLabelClass}>Email</span>
                <input
                  className={authInputClass}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(null);
                    setFormError(null);
                  }}
                  autoComplete="email"
                  inputMode="email"
                />
                {emailError ? (
                  <p className="mt-2 text-sm text-red-600">{emailError}</p>
                ) : null}
              </label>

              <PasswordFieldWithToggle
                label="Password"
                placeholder="Your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null);
                  setFormError(null);
                }}
                visible={showPassword}
                onToggleVisible={() => setShowPassword((v) => !v)}
                error={passwordError}
              />

              {formError ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className={authPrimaryButtonClass}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <p className="text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-cyan-700 hover:text-cyan-600"
                >
                  Register
                </Link>
              </p>

              {/* <p className="text-center text-xs leading-5 text-slate-500">
                Prefer OTP?{" "}
                <Link
                  href="/login/otp"
                  className="font-bold text-cyan-700 hover:text-cyan-600"
                >
                  Sign in with OTP
                </Link>
                .
              </p> */}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
