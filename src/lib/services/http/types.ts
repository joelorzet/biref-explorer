export type HttpFetch = typeof fetch;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  query?: Record<string, string | number | boolean | null | undefined>;
}

export interface ApiClientConfig {
  baseUrl?: string;
  fetchImpl?: HttpFetch;
  defaultHeaders?: Record<string, string>;
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export interface IApiClient {
  get<T>(path: string, options?: HttpRequestOptions): Promise<T>;
  post<T>(
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T>;
  put<T>(
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T>;
  patch<T>(
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T>;
  delete<T>(path: string, options?: HttpRequestOptions): Promise<T>;
}
