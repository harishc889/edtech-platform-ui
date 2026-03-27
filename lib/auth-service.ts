export type AuthStorageStrategy = "httpOnlyCookie" | "localStorage";

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
}

export interface AuthSuccessData {
  token?: string;
  user?: AuthUser;
  message?: string;
}

export interface AuthErrorData {
  message: string;
  details?: unknown;
}

export interface AuthServiceResponse<T = AuthSuccessData> {
  ok: boolean;
  status: number;
  data?: T;
  error?: AuthErrorData;
}

interface AuthServiceOptions {
  storage?: AuthStorageStrategy;
  tokenKey?: string;
  baseUrl?: string;
}

const DEFAULT_TOKEN_KEY = "auth_token";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function buildUrl(path: string, baseUrl?: string) {
  if (!baseUrl) return path;
  const trimmedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${trimmedBase}${path}`;
}

async function safeParseJson(response: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getErrorMessage(
  payload: Record<string, unknown> | null,
  fallback: string,
): string {
  const message = payload?.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  return fallback;
}

async function authRequest<T>(
  endpoint: "/api/auth/login" | "/api/auth/register",
  payload: Record<string, string>,
  options: AuthServiceOptions = {},
): Promise<AuthServiceResponse<T>> {
  const storage = options.storage ?? "httpOnlyCookie";
  const tokenKey = options.tokenKey ?? DEFAULT_TOKEN_KEY;

  try {
    const response = await fetch(buildUrl(endpoint, options.baseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const body = await safeParseJson(response);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: {
          message: getErrorMessage(body, "Request failed. Please try again."),
          details: body ?? undefined,
        },
      };
    }

    // If using localStorage, save token from response payload.
    if (storage === "localStorage" && canUseLocalStorage()) {
      const token = body?.token;
      if (typeof token === "string" && token) {
        window.localStorage.setItem(tokenKey, token);
      }
    }

    return {
      ok: true,
      status: response.status,
      data: (body ?? {}) as T,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: {
        message: "Network error. Please check your connection and try again.",
        details: error,
      },
    };
  }
}

export async function login(
  email: string,
  password: string,
  options: AuthServiceOptions = {},
): Promise<AuthServiceResponse<AuthSuccessData>> {
  return authRequest<AuthSuccessData>(
    "/api/auth/login",
    {
      email: email.trim(),
      password,
    },
    options,
  );
}

export async function register(
  name: string,
  email: string,
  password: string,
  options: AuthServiceOptions = {},
): Promise<AuthServiceResponse<AuthSuccessData>> {
  return authRequest<AuthSuccessData>(
    "/api/auth/register",
    {
      name: name.trim(),
      email: email.trim(),
      password,
    },
    options,
  );
}

export function getStoredToken(tokenKey = DEFAULT_TOKEN_KEY): string | null {
  if (!canUseLocalStorage()) return null;
  return window.localStorage.getItem(tokenKey);
}

export function clearStoredToken(tokenKey = DEFAULT_TOKEN_KEY): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(tokenKey);
}

