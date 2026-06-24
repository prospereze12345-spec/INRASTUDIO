const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function withTrailingSlash(path: string): string {
  const [pathname, search] = path.split("?");
  const normalised = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return search ? `${normalised}?${search}` : normalised;
}

export async function apiFetch<T = unknown>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${withTrailingSlash(path)}`;

  const isObjectBody =
    opts.body &&
    typeof opts.body === "object" &&
    !(opts.body instanceof FormData);

  const res = await fetch(url, {
    credentials: "include",
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
    body: isObjectBody ? JSON.stringify(opts.body) : opts.body,
  });

  if (!res.ok) {
    let body: any = {};
    try {
      body = await res.json();
    } catch {}

    throw new Error(body?.detail || body?.message || `${res.status} ${res.statusText}`);
  }

  return res.status === 204 ? (null as T) : res.json();
}