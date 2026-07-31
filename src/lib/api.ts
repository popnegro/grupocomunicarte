interface ApiClientConfig {
  baseUrl?: string;
  headers?: HeadersInit;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const createApiClient = (config?: ApiClientConfig) => {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...config?.headers,
  };

  const request = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: object
  ): Promise<ApiResponse<T>> => {
    const url = `${config?.baseUrl || ''}${path}`;
    const options: RequestInit = {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        let errorData: any = { message: `Request failed with status ${response.status}` };
        try {
          // Attempt to parse error response from the server
          const errorResult = await response.json();
          errorData = errorResult.error || errorResult;
        } catch (e) {
          // The error response was not valid JSON, use status text
          errorData.message = response.statusText;
        }
        return { success: false, error: errorData.message || 'An unknown error occurred' };
      }

      const result = await response.json();
      return result;

    } catch (error: any) {
      // Handle network errors or other exceptions during fetch
      return { success: false, error: error.message || 'A network error occurred.' };
    }
  };

  return {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T>(path: string, body: object) => request<T>('POST', path, body),
  };
};

export const api = createApiClient();