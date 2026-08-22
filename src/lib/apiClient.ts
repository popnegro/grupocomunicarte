// src/lib/apiClient.ts

import { auth } from "./firebase";

interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  errorDetail?: {
    code: string;
    message: string;
  };
  errorType?: "network" | "server" | "validation" | "unknown";
  isRateLimited?: boolean;
}

// Resolve API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

const buildHeaders = async (headers?: HeadersInit): Promise<Headers> => {
  const result = new Headers(headers);
  const currentUser = auth.currentUser;

  if (currentUser && !result.has("Authorization")) {
    try {
      const idToken = await currentUser.getIdToken();
      result.set("Authorization", `Bearer ${idToken}`);
    } catch (error) {
      console.warn("[safeFetchJson] Unable to obtain Firebase ID token:", error);
    }
  }

  return result;
};

/**
 * Generic fetch wrapper that handles JSON parsing, error responses,
 * and consistent API response formatting.
 * It also prepends the API_BASE_URL if configured.
 */
export async function safeFetchJson<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${path}`;

  try {
    const headers = await buildHeaders(options?.headers);
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || "Server error" };
      }

      return {
        ok: false,
        status: response.status,
        error: errorData.message || `Request failed with status ${response.status}`,
        errorDetail: {
          code: errorData.code || `HTTP_ERROR_${response.status}`,
          message: errorData.message || `Request failed with status ${response.status}`,
        },
        errorType: "server",
      };
    }

    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return { ok: true, status: response.status, data: undefined };
    }

    const data = await response.json();
    return { ok: true, status: response.status, data };
  } catch (e: any) {
    console.error(`[safeFetchJson] Network or parsing error for ${url}:`, e);
    return {
      ok: false,
      status: 0,
      error: e.message || "Network request failed",
      errorDetail: {
        code: "NETWORK_ERROR",
        message: e.message || "Network request failed",
      },
      errorType: "network",
    };
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestInit) =>
    safeFetchJson<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, data?: any, options?: RequestInit) => {
    return safeFetchJson<T>(path, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};