// Custom Typed Error Hierarchy for API Operations
export class ApiError extends Error {
  public readonly status: number;
  public readonly url: string;
  public readonly method: string;
  public readonly data: any;

  constructor(message: string, status: number, url: string, method: string = "GET", data: any = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.method = method;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidContentTypeError extends ApiError {
  public readonly contentType: string;

  constructor(url: string, status: number, method: string, contentType: string, bodySnippet?: string) {
    const msg = `Se esperaba Content-Type "application/json" pero se recibió "${contentType || "desconocido"}" desde ${method} ${url} (HTTP ${status}).${
      bodySnippet ? ` Fragmento del cuerpo: "${bodySnippet.slice(0, 100)}..."` : ""
    }`;
    super(msg, status, url, method);
    this.name = "InvalidContentTypeError";
    this.contentType = contentType;
  }
}

export class NotFoundError extends ApiError {
  constructor(url: string, method: string = "GET", data: any = null) {
    super(`Recurso no encontrado en ${method} ${url} (HTTP 404)`, 404, url, method, data);
    this.name = "NotFoundError";
  }
}

export class ServerError extends ApiError {
  constructor(url: string, status: number, method: string = "GET", data: any = null) {
    super(`Error interno del servidor en ${method} ${url} (HTTP ${status})`, status, url, method, data);
    this.name = "ServerError";
  }
}

export class AuthenticationError extends ApiError {
  constructor(url: string, method: string = "GET", data: any = null) {
    super(`Autenticación requerida para ${method} ${url} (HTTP 401)`, 401, url, method, data);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApiError {
  constructor(url: string, method: string = "GET", data: any = null) {
    super(`Acceso denegado para ${method} ${url} (HTTP 403)`, 403, url, method, data);
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends ApiError {
  constructor(url: string, status: number, method: string = "GET", data: any = null) {
    super(`Error de validación en ${method} ${url} (HTTP ${status})`, status, url, method, data);
    this.name = "ValidationError";
  }
}

export class NetworkError extends Error {
  public readonly url: string;
  public readonly method: string;

  constructor(url: string, method: string = "GET", originalError?: Error) {
    super(`Error de conexión al realizar la petición ${method} ${url}: ${originalError?.message || "Servidor no disponible"}`);
    this.name = "NetworkError";
    this.url = url;
    this.method = method;
  }
}

export class TimeoutError extends Error {
  public readonly url: string;
  public readonly method: string;
  public readonly timeoutMs: number;

  constructor(url: string, method: string = "GET", timeoutMs: number = 15000) {
    super(`La petición ${method} ${url} superó el tiempo límite de ${timeoutMs}ms.`);
    this.name = "TimeoutError";
    this.url = url;
    this.method = method;
    this.timeoutMs = timeoutMs;
  }
}

export interface SafeFetchResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
  errorType?: string;
  errorInstance?: ApiError | NetworkError | TimeoutError;
  isRateLimited?: boolean;
}

export interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Executes an HTTP fetch request with mandatory Content-Type validation, HTTP status checks,
 * configurable timeout via AbortController, and graceful handling of HTML/404/500 errors.
 * Never attempts to parse non-JSON responses as JSON.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: FetchOptions
): Promise<SafeFetchResult<T>> {
  const { timeoutMs = 15000, ...fetchOptions } = options || {};
  const method = (fetchOptions.method || "GET").toUpperCase();
  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const signal = fetchOptions.signal || controller.signal;

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      signal,
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    // Handle 204 No Content
    if (res.status === 204) {
      if (process.env.NODE_ENV !== "production") {
        console.debug(`[API] 204 No Content (${method} ${url}) - ${duration}ms`);
      }
      return { ok: true, status: 204, data: null };
    }

    // Handle 429 Rate Limited
    if (res.status === 429) {
      const text = await res.text().catch(() => "");
      const err = new ApiError("Demasiadas peticiones. Por favor intenta más tarde.", 429, url, method, text);
      return {
        ok: false,
        status: 429,
        data: null,
        error: err.message,
        errorType: "RateLimitError",
        errorInstance: err,
        isRateLimited: true,
      };
    }

    // Validate Content-Type header before attempting JSON parse
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.toLowerCase().includes("application/json");

    if (!isJson) {
      const bodyText = await res.text().catch(() => "");
      const snippet = bodyText.trim().slice(0, 150);

      let errorInstance: ApiError;
      let errorMsg = `Se esperaba respuesta JSON pero se recibió "${contentType || "desconocido"}" (HTTP ${res.status}).`;
      let errorType = "InvalidContentTypeError";

      if (res.status === 404) {
        errorMsg = `Endpoint o recurso no encontrado en ${url} (HTTP 404).`;
        errorType = "NotFoundError";
        errorInstance = new NotFoundError(url, method, bodyText);
      } else if (res.status >= 500) {
        errorMsg = `Error interno del servidor en ${url} (HTTP ${res.status}).`;
        errorType = "ServerError";
        errorInstance = new ServerError(url, res.status, method, bodyText);
      } else {
        if (snippet.startsWith("<!") || snippet.toLowerCase().includes("<html")) {
          errorMsg = `Ruta API no válida o página HTML devuelta por el servidor (HTTP ${res.status}).`;
        }
        errorInstance = new InvalidContentTypeError(url, res.status, method, contentType, snippet);
      }

      if (process.env.NODE_ENV !== "production") {
        console.warn(`[API WARNING] Non-JSON response for ${method} ${url}:`, {
          status: res.status,
          contentType,
          duration: `${duration}ms`,
          snippet,
        });
      }

      return {
        ok: false,
        status: res.status,
        data: null,
        error: errorMsg,
        errorType,
        errorInstance,
      };
    }

    // Parse JSON safely
    let json: any = null;
    try {
      json = await res.json();
    } catch (parseErr: any) {
      const err = new ApiError("Error al interpretar la respuesta JSON del servidor.", res.status, url, method, parseErr?.message);
      return {
        ok: false,
        status: res.status,
        data: null,
        error: err.message,
        errorType: "JsonParseError",
        errorInstance: err,
      };
    }

    if (process.env.NODE_ENV !== "production") {
      console.debug(`[API SUCCESS] ${method} ${url} - ${res.status} (${duration}ms)`);
    }

    if (!res.ok) {
      let errorInstance: ApiError;
      let errorType = "ApiError";

      if (res.status === 401) {
        errorType = "AuthenticationError";
        errorInstance = new AuthenticationError(url, method, json);
      } else if (res.status === 403) {
        errorType = "AuthorizationError";
        errorInstance = new AuthorizationError(url, method, json);
      } else if (res.status === 404) {
        errorType = "NotFoundError";
        errorInstance = new NotFoundError(url, method, json);
      } else if (res.status === 400 || res.status === 422) {
        errorType = "ValidationError";
        errorInstance = new ValidationError(url, res.status, method, json);
      } else if (res.status >= 500) {
        errorType = "ServerError";
        errorInstance = new ServerError(url, res.status, method, json);
      } else {
        errorInstance = new ApiError(json?.error || json?.message || `HTTP ${res.status}`, res.status, url, method, json);
      }

      return {
        ok: false,
        status: res.status,
        data: json,
        error: json?.error || json?.message || `Error HTTP ${res.status}`,
        errorType,
        errorInstance,
      };
    }

    return {
      ok: true,
      status: res.status,
      data: json,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err?.name === "AbortError") {
      const timeoutError = new TimeoutError(url, method, timeoutMs);
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[API TIMEOUT] ${method} ${url} timed out after ${timeoutMs}ms`);
      }
      return {
        ok: false,
        status: 0,
        data: null,
        error: timeoutError.message,
        errorType: "TimeoutError",
        errorInstance: timeoutError,
      };
    }

    const netErr = new NetworkError(url, method, err);
    if (process.env.NODE_ENV !== "production") {
      console.error(`[API ERROR] Network failure for ${method} ${url}:`, err);
    }
    return {
      ok: false,
      status: 0,
      data: null,
      error: netErr.message,
      errorType: "NetworkError",
      errorInstance: netErr,
    };
  }
}

export const apiClient = {
  get: <T = any>(url: string, options?: FetchOptions) =>
    safeFetchJson<T>(url, { ...options, method: "GET" }),
  post: <T = any>(url: string, body?: any, options?: FetchOptions) =>
    safeFetchJson<T>(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T = any>(url: string, body?: any, options?: FetchOptions) =>
    safeFetchJson<T>(url, {
      ...options,
      method: "PUT",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T = any>(url: string, options?: FetchOptions) =>
    safeFetchJson<T>(url, { ...options, method: "DELETE" }),
  patch: <T = any>(url: string, body?: any, options?: FetchOptions) =>
    safeFetchJson<T>(url, {
      ...options,
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
};

