"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { login } from "@/lib/auth-service";

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

      router.push("/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="rounded-3xl bg-white/60 p-10 shadow-lg ring-1 ring-zinc-200 backdrop-blur">
            <p className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
              Welcome back
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900">
              Sign in to your learning dashboard
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Track progress, join live classes, and keep your learning streak
              going.
            </p>
            <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-zinc-200">
              <p className="text-sm font-semibold text-zinc-900">
                Secure authentication
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                We keep your session active and protect your account with secure
                token handling.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl bg-white/90 p-7 shadow-lg ring-1 ring-zinc-200 backdrop-blur">
            <div className="text-center">
              <p className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
                Secure login
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
                Login
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Use your email and password to continue.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleLogin}>
              <label className="block">
                <span className="text-sm font-medium text-zinc-900">Email</span>
                <input
                  className="mt-2 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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

              <label className="block">
                <span className="text-sm font-medium text-zinc-900">
                  Password
                </span>
                <div className="mt-2 flex items-stretch gap-2">
                  <input
                    className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(null);
                      setFormError(null);
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="shrink-0 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordError ? (
                  <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                ) : null}
              </label>

              {formError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <p className="text-center text-sm text-zinc-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-indigo-700 hover:text-indigo-600"
                >
                  Register
                </Link>
              </p>

              <p className="text-center text-xs leading-5 text-zinc-500">
                Prefer OTP?{" "}
                <Link
                  href="/login/otp"
                  className="font-semibold text-indigo-700 hover:text-indigo-600"
                >
                  Sign in with OTP
                </Link>
                .
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

