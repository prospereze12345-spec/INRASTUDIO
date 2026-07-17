const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// Truly public: no benefit from attaching a token, and a stale token must
// never be allowed to 401 these before login even happens.
const PUBLIC_PATHS = [
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/refresh",
];

// Public, but personalized when a valid token is present (e.g. currency
// on pricing). Token is attached if we have one; if the request 401s
// because that token is stale/invalid, we retry once WITHOUT it instead
// of failing outright — the endpoint itself is AllowAny.
const SOFT_PUBLIC_PATHS = [
  "/api/pricing/plans",
];

function matchesPath(pathname: string, list: string[]): boolean {
  return list.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isPublicPath(pathname: string): boolean {
  return matchesPath(pathname, PUBLIC_PATHS);
}

function isSoftPublicPath(pathname: string): boolean {
  return matchesPath(pathname, SOFT_PUBLIC_PATHS);
}

function withTrailingSlash(path: string): string {
  const [pathname, search] = path.split("?");
  const normalised = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return search ? `${normalised}?${search}` : normalised;
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface ApiFetchOptions extends RequestInit {
  skipAuth?: boolean;
  timeoutMs?: number;
  _isRetry?: boolean;
  /** Internal flag: this is the soft-public no-token fallback retry. */
  _softRetry?: boolean;
}

let refreshInFlight: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE}${withTrailingSlash("/api/auth/refresh")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (!data.access) return false;

      localStorage.setItem("access", data.access);
      return true;
    } catch {
      return false;
    }
  })();

  const result = await refreshInFlight;
  refreshInFlight = null;
  return result;
}

export async function apiFetch<T = unknown>(
  path: string,
  opts: ApiFetchOptions = {}
): Promise<T> {
  const { skipAuth, timeoutMs = 40000, _isRetry, _softRetry, ...init } = opts;

  const normalisedPath = withTrailingSlash(path);
  const url = `${API_BASE}${normalisedPath}`;
  const pathname = path.split("?")[0];
  const publicRoute = isPublicPath(pathname);
  const softPublicRoute = isSoftPublicPath(pathname);

  const token =
    typeof window !== "undefined" && !skipAuth && !publicRoute && !_softRetry
      ? localStorage.getItem("access")
      : null;

  const headers = new Headers(init.headers);

  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      credentials: "include",
      headers,
      signal: init.signal ?? controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(`Request timed out after ${timeoutMs}ms`, 0, null);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  // Soft-public route + 401 + we actually sent a token: that token is
  // stale/invalid. Don't attempt refresh (would loop into the same
  // problem on refresh failure) — just retry once with no auth at all,
  // since the endpoint works fine anonymously.
  if (
    res.status === 401 &&
    softPublicRoute &&
    token &&
    !_softRetry &&
    typeof window !== "undefined"
  ) {
    return apiFetch<T>(path, { ...opts, _softRetry: true });
  }

  // Access token expired mid-session on a genuinely protected route.
  if (res.status === 401 && !publicRoute && !softPublicRoute && !_isRetry && typeof window !== "undefined") {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...opts, _isRetry: true });
    }
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }

  if (!res.ok) {
    let body: unknown = {};
    try {
      body = await res.json();
    } catch {
      // non-JSON error body
    }

    const message =
      (body as any)?.detail ||
      (body as any)?.error ||
      (body as any)?.message ||
      `${res.status} ${res.statusText}`;

    throw new ApiError(message, res.status, body);
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json();
}