"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { register } from "@/lib/auth-service";
import {
  PasswordFieldWithToggle,
  authInputClass,
  authLabelClass,
  authPrimaryButtonClass,
} from "@/app/components/password-field-with-toggle";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validate(
    nextName: string,
    nextEmail: string,
    nextPassword: string,
    nextConfirmPassword: string,
  ) {
    const nextErrors: typeof fieldErrors = {};

    if (!nextName) nextErrors.name = "Name is required.";
    if (!nextEmail) nextErrors.email = "Email is required.";
    else if (!isValidEmail(nextEmail))
      nextErrors.email = "Enter a valid email address.";

    if (!nextPassword) nextErrors.password = "Password is required.";
    if (!nextConfirmPassword)
      nextErrors.confirmPassword = "Please confirm your password.";

    if (
      nextPassword &&
      nextConfirmPassword &&
      nextPassword !== nextConfirmPassword
    ) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const nextName = (formData.get("name")?.toString() ?? name).trim();
    const nextEmail = (formData.get("email")?.toString() ?? email).trim();
    const nextPassword = formData.get("password")?.toString() ?? password;
    const nextConfirmPassword =
      formData.get("confirmPassword")?.toString() ?? confirmPassword;

    setName(nextName);
    setEmail(nextEmail);
    setPassword(nextPassword);
    setConfirmPassword(nextConfirmPassword);

    if (
      !validate(nextName, nextEmail, nextPassword, nextConfirmPassword)
    )
      return;

    setIsSubmitting(true);
    try {
      const response = await register(nextName, nextEmail, nextPassword);

      if (!response.ok) {
        setFormError(
          response.error?.message ?? "Registration failed. Please try again.",
        );
        return;
      }

      router.push("/dashboard");
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
              className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"
              aria-hidden
            />
            <p className="relative inline-flex w-fit rounded-full border border-cyan-400/40 bg-cyan-950/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-50">
              Get started
            </p>
            <h1 className="font-display relative mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white">
              Create your account
            </h1>
            <p className="relative mt-4 max-w-md text-base leading-relaxed text-slate-200">
              Join live classes, track your progress, and learn practical skills
              that matter.
            </p>

            <div className="relative mt-10 space-y-4 rounded-2xl border border-white/20 bg-slate-900/40 p-6 backdrop-blur-sm">
              <p className="text-sm font-bold text-white">What you get</p>
              <ul className="space-y-2 text-sm text-slate-200">
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span> Course progress
                  tracking
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span> Live class access
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400">✓</span> Personalized learning
                  paths
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-md items-center lg:max-w-none lg:py-4">
          <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
            <div className="text-center lg:text-left">
              <p className="inline-flex rounded-full bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800">
                Register
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900">
                Create an account
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Fill in your details to get started.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleRegister}>
              <label className="block">
                <span className={authLabelClass}>Name</span>
                <input
                  name="name"
                  className={authInputClass}
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    setFormError(null);
                  }}
                  autoComplete="name"
                />
                {fieldErrors.name ? (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.name}</p>
                ) : null}
              </label>

              <label className="block">
                <span className={authLabelClass}>
                  Email
                </span>
                <input
                  name="email"
                  className={authInputClass}
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    setFormError(null);
                  }}
                  autoComplete="email"
                  inputMode="email"
                />
                {fieldErrors.email ? (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </label>

              <PasswordFieldWithToggle
                label="Password"
                name="password"
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({
                    ...prev,
                    password: undefined,
                    confirmPassword: undefined,
                  }));
                  setFormError(null);
                }}
                visible={showPassword}
                onToggleVisible={() => setShowPassword((v) => !v)}
                error={fieldErrors.password}
              />

              <PasswordFieldWithToggle
                label="Confirm password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                  setFormError(null);
                }}
                visible={showConfirmPassword}
                onToggleVisible={() => setShowConfirmPassword((v) => !v)}
                error={fieldErrors.confirmPassword}
                ariaLabelShow="Show confirm password"
                ariaLabelHide="Hide confirm password"
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
                {isSubmitting ? "Registering..." : "Register"}
              </button>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-cyan-700 hover:text-cyan-600"
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
