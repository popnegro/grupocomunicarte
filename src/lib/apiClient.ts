// src/lib/apiClient.ts

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

const JSON_BACKED_ARRAY_FIELDS = new Set([
  "screenIds",
  "soportesEdicionInline",
  "comentarios",
  "historial",
]);

function coerceJsonBackedArray(value: string): unknown[] | null {
  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) return parsed;

    if (parsed && typeof parsed === "object") {
      const record = parsed as Record<string, unknown>;
      if (Array.isArray(record.data)) return record.data;
      if (Array.isArray(record.items)) return record.items;

      const values = Object.values(record);
      if (values.length > 0 && values.every((item) => item && typeof item === "object")) {
        return values;
      }
    }
  } catch {
    // Keep invalid/non-JSON strings out of array consumers by returning null.
  }

  return null;
}

function parseJsonBackedArrays(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(parseJsonBackedArrays);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const normalized: Record<string, unknown> = { ...record };

    for (const [key, fieldValue] of Object.entries(record)) {
      if (JSON_BACKED_ARRAY_FIELDS.has(key)) {
        if (typeof fieldValue === "string") {
          const parsed = coerceJsonBackedArray(fieldValue);
          normalized[key] = parsed ? parsed.map(parseJsonBackedArrays) : [];
          continue;
        }

        if (!Array.isArray(fieldValue) && fieldValue && typeof fieldValue === "object") {
          const values = Object.values(fieldValue as Record<string, unknown>);
          normalized[key] = values.map(parseJsonBackedArrays);
          continue;
        }
      }

      normalized[key] = parseJsonBackedArrays(fieldValue);
    }

    return normalized;
  }

  return value;
}

/**
 * Generic fetch wrapper that handles JSON parsing, error responses,
 * authentication and normalization of JSON-backed PostgreSQL fields.
 */
export async function safeFetchJson<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${path}`;

  try {
    const requestHeaders = new Headers(options?.headers || {});

    // Attach the Firebase ID token automatically to authenticated API calls.
    // Import lazily so public routes remain usable before Firebase initializes.
    if (!requestHeaders.has("Authorization")) {
      try {
        const { auth } = await import("./firebase");
        const currentUser = auth.currentUser;
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          requestHeaders.set("Authorization", `Bearer ${idToken}`);
        }
      } catch {
        // Public endpoints and unauthenticated calls continue without a token.
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: requestHeaders,
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (e) {
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
    return {
      ok: true,
      status: response.status,
      data: parseJsonBackedArrays(data) as T,
    };
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