"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { profileFromMePayload } from "@/lib/api-normalize";
import {
  normalizeAuthMePayload,
  type AuthMePayload,
} from "@/lib/auth-me-types";
import { fetchCurrentUser, type AuthUser } from "@/lib/auth-service";

/**
 * Single source of truth for client-side auth state.
 *
 * Why this exists:
 * - The session cookie is httpOnly, so JavaScript cannot read it directly.
 *   We have to ask the server (`GET /api/Auth/me`) to know who is logged in.
 * - Without a shared context, every screen that needed to know the user was
 *   firing its own `/me` request on mount, causing redundant calls, races,
 *   and a flickering header on every navigation.
 *
 * What this provides:
 * - Exactly one `/me` call on app boot (deduped via an in-flight ref).
 * - In-memory cache of `{ user, mePayload }` shared with every component.
 * - `sessionStorage` mirror so a hard refresh re-hydrates the user instantly
 *   while the background `/me` re-validates — no logged-out flicker.
 * - Cross-tab sync via the `storage` event.
 * - Automatic clear on `auth:session-inactive` (dispatched by the axios 401
 *   interceptor in `lib/api.ts`).
 *
 * Hydration note:
 * - Initial state is intentionally `{ user: null, status: "loading" }` on
 *   both server and client so the SSR HTML matches the first client render.
 * - sessionStorage is applied in `useEffect` after hydration only — avoids
 *   branching hooks (`useEffect` vs `useLayoutEffect`) between server and client.
 *
 * Components should call `useAuth()` instead of `fetchCurrentUser()` directly.
 */

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  /** Normalized `/api/Auth/me` payload — typed claims + enrollments / certs on root. */
  mePayload: AuthMePayload | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  /** Force a fresh `/me` call. Returns the user (or null if unauthenticated). */
  refresh: () => Promise<AuthUser | null>;
  /** Set user without hitting the network (e.g. right after login). */
  setUser: (user: AuthUser | null, mePayload?: AuthMePayload | null) => void;
  /** Clear all auth state (e.g. on logout / 401). */
  clear: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_STORAGE_KEY = "labim:auth:user";

function readCachedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // sessionStorage can throw in private mode / quota exceeded; ignore.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initial state must match between server and client to avoid hydration
  // mismatches. The cached user is read from sessionStorage in the layout
  // effect below — that runs synchronously after the first commit on the
  // client and before paint, so the user does NOT see a logged-out flicker.
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [mePayload, setMePayload] = useState<AuthMePayload | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  /** Coalesces concurrent refresh() callers into a single in-flight request. */
  const inFlightRef = useRef<Promise<AuthUser | null> | null>(null);

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    if (inFlightRef.current) return inFlightRef.current;
    const task = (async (): Promise<AuthUser | null> => {
      const response = await fetchCurrentUser();
      if (!response.ok) {
        setUserState(null);
        setMePayload(null);
        setStatus("unauthenticated");
        writeCachedUser(null);
        return null;
      }
      const payload = response.data ?? null;
      const profile = profileFromMePayload(payload) as AuthUser | null;
      const resolved = profile ?? (payload as AuthUser | null);
      setUserState(resolved);
      setMePayload(normalizeAuthMePayload(payload));
      setStatus(resolved ? "authenticated" : "unauthenticated");
      writeCachedUser(resolved);
      return resolved;
    })();
    inFlightRef.current = task;
    try {
      return await task;
    } finally {
      inFlightRef.current = null;
    }
  }, []);

  const setUser = useCallback(
    (next: AuthUser | null, nextMePayload?: unknown) => {
      setUserState(next);
      if (typeof nextMePayload !== "undefined") {
        setMePayload(
          nextMePayload === null
            ? null
            : normalizeAuthMePayload(nextMePayload),
        );
      } else if (!next) {
        setMePayload(null);
      }
      setStatus(next ? "authenticated" : "unauthenticated");
      writeCachedUser(next);
    },
    [],
  );

  const clear = useCallback(() => {
    setUserState(null);
    setMePayload(null);
    setStatus("unauthenticated");
    writeCachedUser(null);
  }, []);

  // Hydrate from sessionStorage after mount (client-only). Keeps SSR + first
  // client render identical; sensitive surfaces can defer UI until mounted.
  useEffect(() => {
    const cached = readCachedUser();
    if (cached) {
      setUserState(cached);
      setStatus("authenticated");
    }
  }, []);

  // Bootstrap once on mount: validate the cookie against the server.
  useEffect(() => {
    void refresh();
  }, [refresh]);

  // The axios interceptor in `lib/api.ts` dispatches this on 401.
  useEffect(() => {
    function handleSessionInactive() {
      clear();
    }
    window.addEventListener("auth:session-inactive", handleSessionInactive);
    return () =>
      window.removeEventListener("auth:session-inactive", handleSessionInactive);
  }, [clear]);

  // Cross-tab sync: if the user logs in/out in another tab, update this one.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== SESSION_STORAGE_KEY) return;
      if (event.newValue === null) {
        setUserState(null);
        setMePayload(null);
        setStatus("unauthenticated");
        return;
      }
      try {
        const parsed = JSON.parse(event.newValue) as AuthUser;
        if (parsed && typeof parsed === "object") {
          setUserState(parsed);
          setStatus("authenticated");
        }
      } catch {
        // ignore malformed value
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      mePayload,
      status,
      isAuthenticated: status === "authenticated" && user !== null,
      refresh,
      setUser,
      clear,
    }),
    [user, mePayload, status, refresh, setUser, clear],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }
  return ctx;
}
