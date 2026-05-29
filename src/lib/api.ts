const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001/api";
const TOKEN_KEY = "sylarm_token";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

type RequestInitWithJson = Omit<RequestInit, "body"> & {
  json?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
};

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInitWithJson = {},
): Promise<T> {
  const { json, query, headers, ...rest } = init;

  const url = new URL(path.startsWith("/") ? path.slice(1) : path, API_URL + "/");
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }

  const token = getToken();
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string> | undefined),
  };

  const res = await fetch(url.toString(), {
    ...rest,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : undefined,
    cache: rest.cache ?? "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      (payload as { message?: string } | null)?.message ??
      `Request failed (${res.status})`;
    const errors = (payload as { errors?: Record<string, string[]> } | null)
      ?.errors;
    throw new ApiError(message, res.status, errors);
  }

  return payload as T;
}

// Convenience helpers
export const api = {
  get: <T = unknown>(
    path: string,
    query?: RequestInitWithJson["query"],
    init?: Omit<RequestInitWithJson, "json" | "query">,
  ) => apiFetch<T>(path, { ...init, method: "GET", query }),

  post: <T = unknown>(
    path: string,
    json?: unknown,
    init?: Omit<RequestInitWithJson, "json">,
  ) => apiFetch<T>(path, { ...init, method: "POST", json }),

  put: <T = unknown>(
    path: string,
    json?: unknown,
    init?: Omit<RequestInitWithJson, "json">,
  ) => apiFetch<T>(path, { ...init, method: "PUT", json }),

  del: <T = unknown>(
    path: string,
    init?: Omit<RequestInitWithJson, "json">,
  ) => apiFetch<T>(path, { ...init, method: "DELETE" }),
};
