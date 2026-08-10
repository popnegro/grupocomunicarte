// src/lib/apiClient.ts

interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string; // Change to simple string for wide-ranging type safety
  errorDetail?: { // Keep rich structured details separate
    code: string;
    message: string;
  };
  errorType?: "network" | "server" | "validation" | "unknown";
  isRateLimited?: boolean; // Added for consistency with GmailModule
}

// Resolve API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

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
    const response = await fetch(url, options);

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: any = {};
      try {
        // Attempt to parse JSON error from server
        errorData = await response.json();
      } catch (e) {
        // If not JSON, use statusText or a generic message
        errorData = { message: response.statusText || "Server error" };
      }

      const status = response.status;
      const errorMessage =
        errorData?.message ||
        errorData?.error?.message ||
        `Request failed with status ${status}`;
      const errorCode =
        errorData?.code ||
        errorData?.error?.code ||
        `HTTP_ERROR_${status}`;
      const errorType: ApiResponse<T>["errorType"] =
        status === 429 ? "server" : status >= 400 && status < 500 ? "validation" : "server";

      return {
        ok: false,
        status,
        error: errorMessage,
        errorDetail: {
          code: errorCode,
          message: errorMessage,
        },
        errorType,
        isRateLimited: status === 429,
      };
    }

    // Handle successful responses, including those with no content (204)
    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return { ok: true, status: response.status, data: undefined };
    }

    // Attempt to parse JSON
    const data = await response.json();
    return { ok: true, status: response.status, data };
  } catch (e: any) {
    console.error(`[safeFetchJson] Network or parsing error for ${url}:`, e);
    return {
      ok: false,
      status: 0, // No HTTP status for network errors
      error: e.message || "Network request failed",
      errorDetail: {
        code: "NETWORK_ERROR",
        message: e.message || "Network request failed",
      },
      errorType: "network",
    };
  }
}

// Simple wrapper for GET and POST requests
export const apiClient = {
  get: <T>(path: string, options?: RequestInit) => safeFetchJson<T>(path, { ...options, method: "GET" }),
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