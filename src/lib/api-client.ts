import type { ApiError } from "@/types/api-types";

const API_BASE_URL = "https://kalibarasi-biru-langit.vercel.app";

export class ApiClientError extends Error {
  status?: number;
  code?: string;

  constructor(
    message: string,
    status?: number,
    code?: string
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorCode = `HTTP_${response.status}`;

    try {
      const errorData: ApiError = await response.json();
      errorMessage = errorData.message || errorMessage;
      errorCode = errorData.code || errorCode;
    } catch {
      // If error response is not JSON, use default message
    }

    throw new ApiClientError(errorMessage, response.status, errorCode);
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return {} as T;
  }

  const json = await response.json();
  
  // Unwrap API response if it has success/data structure
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    // Check if there are metadata fields (pagination, range, interval, etc.)
    const metadataKeys = ['total', 'limit', 'offset', 'range', 'interval', 'count'];
    const hasMetadata = metadataKeys.some(key => key in json);
    
    if (hasMetadata) {
      // For responses with metadata (like pagination), preserve all fields except 'success'
      const { success, ...rest } = json;
      return rest as T;
    } else {
      // For simple responses, return just the data
      return json.data as T;
    }
  }
  
  return json as T;
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(endpoint, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    return handleResponse<T>(response);
  },

  // Helper for downloading files
  async download(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<Blob> {
    const url = buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new ApiClientError(`Failed to download: ${response.statusText}`, response.status);
    }

    return response.blob();
  },
};
