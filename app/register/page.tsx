"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

function isValidEmail(email: string) {
  // Simple, pragmatic email check for UI validation.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function validate() {
    const nextErrors: typeof fieldErrors = {};
    const nextName = name.trim();
    const nextEmail = email.trim();

    if (!nextName) nextErrors.name = "Name is required.";
    if (!nextEmail) nextErrors.email = "Email is required.";
    else if (!isValidEmail(nextEmail)) nextErrors.email = "Enter a valid email address.";

    if (!password) nextErrors.password = "Password is required.";
    if (!confirmPassword) nextErrors.confirmPassword = "Please confirm your password.";

    if (password && confirmPassword && password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Demo UI only: simulate registration.
      await new Promise((r) => setTimeout(r, 800));
      setSuccessMessage("Registration successful! You can now log in.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
              Get started
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900">
              Create your account
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Join live classes, track your progress, and learn practical skills that matter.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-white p-6 ring-1 ring-zinc-200">
              <div className="text-sm font-semibold text-zinc-900">What you get</div>
              <div className="text-sm text-zinc-600">- Course progress tracking</div>
              <div className="text-sm text-zinc-600">- Live class access</div>
              <div className="text-sm text-zinc-600">- Personalized learning paths</div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl bg-white/90 p-7 shadow-lg ring-1 ring-zinc-200 backdrop-blur">
            <div className="text-center">
              <p className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
                Register
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
                Create an account
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Fill in your details to get started.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleRegister}>
              <label className="block">
                <span className="text-sm font-medium text-zinc-900">Name</span>
                <input
                  className="mt-2 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  autoComplete="name"
                />
                {fieldErrors.name ? (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.name}</p>
                ) : null}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-900">Email</span>
                <input
                  className="mt-2 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  autoComplete="email"
                  inputMode="email"
                />
                {fieldErrors.email ? (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
                ) : null}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-900">Password</span>
                <input
                  className="mt-2 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Create a password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: undefined, confirmPassword: undefined }));
                  }}
                  autoComplete="new-password"
                />
                {fieldErrors.password ? (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>
                ) : null}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-900">
                  Confirm password
                </span>
                <input
                  className="mt-2 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Re-enter your password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  autoComplete="new-password"
                />
                {fieldErrors.confirmPassword ? (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                ) : null}
              </label>

              {successMessage ? (
                <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  {successMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>

              <p className="text-center text-sm text-zinc-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-700 hover:text-indigo-600"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

