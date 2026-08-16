// src/lib/apiClient.ts

import { auth } from "./firebase-auth-core";

interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  errorDetail?: { code: string; message: string };
  errorType?: "network" | "server" | "validation" | "unknown";
  isRateLimited?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
const API_TIMEOUT_MS = 8000;

async function withAuthHeader(options?: RequestInit): Promise<RequestInit> {
  const currentUser = auth.currentUser;
  const headers = new Headers(options?.headers);
  if (currentUser) {
    const idToken = await currentUser.getIdToken();
    if (idToken) headers.set("Authorization", `Bearer ${idToken}`);
  }
  return { ...options, headers };
}

export async function safeFetchJson<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const authenticatedOptions = await withAuthHeader(options);
    const response = await fetch(url, {
      ...authenticatedOptions,
      signal: options?.signal ?? controller.signal,
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || "Server error" };
      }
      const status = response.status;
      const errorMessage = errorData?.message || errorData?.error?.message || `Request failed with status ${status}`;
      const errorCode = errorData?.code || errorData?.error?.code || `HTTP_ERROR_${status}`;
      const errorType: ApiResponse<T>["errorType"] = status === 429 ? "server" : status >= 400 && status < 500 ? "validation" : "server";
      return {
        ok: false,
        status,
        error: errorMessage,
        errorDetail: { code: errorCode, message: errorMessage },
        errorType,
        isRateLimited: status === 429,
      };
    }

    if (response.status === 204) return { ok: true, status: response.status, data: undefined };

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return {
        ok: false,
        status: response.status,
        error: "La API devolvió una respuesta no JSON inesperada.",
        errorDetail: {
          code: "INVALID_RESPONSE_FORMAT",
          message: "La API devolvió una respuesta no JSON inesperada.",
        },
        errorType: "server",
      };
    }

    const data = await response.json();
    return { ok: true, status: response.status, data };
  } catch (e: any) {
    const isTimeout = e?.name === "AbortError";
    const message = isTimeout
      ? `La solicitud a ${path} superó el tiempo máximo de espera (${API_TIMEOUT_MS / 1000}s).`
      : e?.message || "Network request failed";

    console.error(`[safeFetchJson] ${isTimeout ? "Timeout" : "Network or parsing error"} for ${url}:`, e);

    return {
      ok: false,
      status: 0,
      error: message,
      errorDetail: {
        code: isTimeout ? "API_TIMEOUT" : "NETWORK_ERROR",
        message,
      },
      errorType: "network",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestInit) => safeFetchJson<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, data?: any, options?: RequestInit) => safeFetchJson<T>(path, {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    body: data === undefined ? undefined : JSON.stringify(data),
  }),
  put: <T>(path: string, data?: any, options?: RequestInit) => safeFetchJson<T>(path, {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    body: data === undefined ? undefined : JSON.stringify(data),
  }),
  delete: <T>(path: string, options?: RequestInit) => safeFetchJson<T>(path, { ...options, method: "DELETE" }),
};
