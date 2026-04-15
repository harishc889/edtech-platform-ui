"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/app/components/toast-provider";
import { fetchCurrentUser, logout, type AuthUser } from "@/lib/auth-service";
import { PROGRAM_CATALOG } from "@/lib/program-catalog";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [desktopCoursesOpen, setDesktopCoursesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authVersion, setAuthVersion] = useState(0);
  const { showToast } = useToast();
  const desktopCoursesRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!desktopCoursesRef.current) return;
      if (!desktopCoursesRef.current.contains(event.target as Node)) {
        setDesktopCoursesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    function handleAuthChanged() {
      setAuthVersion((v) => v + 1);
    }
    window.addEventListener("auth:changed", handleAuthChanged);
    return () => window.removeEventListener("auth:changed", handleAuthChanged);
  }, []);

  useEffect(() => {
    let active = true;
    async function loadCurrentUser() {
      const isAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/register");
      if (isAuthPage) {
        setCurrentUser(null);
        setCheckingAuth(false);
        return;
      }

      setCheckingAuth(true);
      const response = await fetchCurrentUser();
      if (!active) return;
      setCurrentUser(response.ok ? response.data ?? null : null);
      setCheckingAuth(false);
    }
    void loadCurrentUser();
    return () => {
      active = false;
    };
  }, [pathname, authVersion]);

  function clearClientAuthArtifacts() {
    const removableKeys = [
      "token",
      "auth_token",
      "access_token",
      "refresh_token",
      "jwt",
      "user",
      "currentUser",
    ];
    for (const key of removableKeys) {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    }

    const cookieNames = [
      "auth_token",
      "token",
      "access_token",
      "refresh_token",
      "jwt",
    ];
    for (const name of cookieNames) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=None; Secure`;
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    let logoutSuccessful = false;
    try {
      const response = await logout();
      logoutSuccessful = response.ok;
    } finally {
      clearClientAuthArtifacts();
      setCurrentUser(null);
      setProfileOpen(false);
      setOpen(false);
      window.dispatchEvent(new Event("auth:changed"));
      showToast({
        type: logoutSuccessful ? "success" : "error",
        message: logoutSuccessful
          ? "Logged out successfully."
          : "Logged out locally. Server logout failed.",
      });
      router.push("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  const profileLabel =
    currentUser?.name?.trim() || currentUser?.email?.trim() || "Profile";
  const initials = profileLabel.slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:min-h-[4.25rem] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl py-1 pr-1 transition hover:opacity-90 sm:gap-3"
        >
          <span className="relative h-10 w-9 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200/90 sm:h-11 sm:w-10">
            <Image
              src="/images/la-bim-academy-logo.png"
              alt=""
              fill
              className="object-contain object-center p-0.5"
              sizes="(max-width: 640px) 36px, 44px"
            />
          </span>
          <span className="flex min-w-0 flex-col text-left">
            <span className="font-display text-base font-bold leading-tight tracking-tight text-slate-900 sm:text-xl sm:whitespace-nowrap">
              <span className="block sm:inline">LA Bim </span>
              <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent transition group-hover:from-cyan-500 group-hover:to-blue-500 sm:inline">
                Academy
              </span>
            </span>
            <span className="mt-0.5 max-w-[11rem] text-[13px] font-medium leading-snug text-slate-500 sm:mt-1 sm:max-w-none sm:text-xs">
              From Learning to Smart Building
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-cyan-700"
          >
            Home
          </Link>
          <div ref={desktopCoursesRef} className="relative">
            <button
              type="button"
              onClick={() => setDesktopCoursesOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-cyan-700"
              aria-expanded={desktopCoursesOpen}
              aria-haspopup="menu"
            >
              Courses
              <svg
                className={`h-4 w-4 text-slate-500 transition ${desktopCoursesOpen ? "rotate-180 text-cyan-700" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.172l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {desktopCoursesOpen ? (
              <div className="absolute left-0 top-full z-50 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/60">
                {PROGRAM_CATALOG.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800"
                    onClick={() => setDesktopCoursesOpen(false)}
                  >
                    {course.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {navLinks.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-cyan-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/enroll"
            className="rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/35"
          >
            Enroll now
          </Link>
          {checkingAuth ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-slate-200" />
          ) : currentUser ? (
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                onClick={() => setProfileOpen((v) => !v)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="max-w-28 truncate">{profileLabel}</span>
                <svg
                  className={`h-4 w-4 text-slate-500 transition ${profileOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.172l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {profileOpen ? (
                <div className="absolute right-0 top-full z-50 mt-3 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/60">
                  <Link
                    href="/dashboard"
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 md:hidden"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <button
              type="button"
              className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setCoursesOpen((v) => !v)}
              aria-expanded={coursesOpen}
            >
              Courses
              <svg
                className={`h-4 w-4 text-slate-500 transition ${coursesOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.172l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {coursesOpen ? (
              <div className="ml-2 space-y-1 rounded-xl border border-slate-100 bg-slate-50/70 p-2">
                {PROGRAM_CATALOG.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-white hover:text-cyan-700"
                    onClick={() => {
                      setOpen(false);
                      setCoursesOpen(false);
                    }}
                  >
                    {course.title}
                  </Link>
                ))}
              </div>
            ) : null}

            {navLinks.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/enroll"
              className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-3 text-left text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Enroll now
            </Link>
            {checkingAuth ? (
              <div className="mt-2 h-10 w-full animate-pulse rounded-xl bg-slate-100" />
            ) : currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  className="mt-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="mt-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
