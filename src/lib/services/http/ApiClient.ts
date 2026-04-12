import {
  type ApiClientConfig,
  HttpError,
  type HttpFetch,
  type HttpMethod,
  type HttpRequestOptions,
  type IApiClient,
} from './types';

/**
 * Minimal fetch-based HTTP client. Domain services (DbScannerService,
 * etc.) own the URL shapes and wire them to their own methods; this
 * class only knows how to issue requests and normalize errors.
 */
export class ApiClient implements IApiClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: HttpFetch;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? '';
    this.fetchImpl = config.fetchImpl ?? fetch.bind(globalThis);
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  get<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    body: unknown,
    options: HttpRequestOptions = {},
  ): Promise<T> {
    const url = this.buildUrl(path, options.query);
    const hasBody =
      body !== undefined && method !== 'GET' && method !== 'DELETE';
    const res = await this.fetchImpl(url, {
      method,
      signal: options.signal,
      headers: {
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...this.defaultHeaders,
        ...options.headers,
      },
      body: hasBody ? JSON.stringify(body) : undefined,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        (payload as { detail?: string; error?: string }).detail ||
        (payload as { error?: string }).error ||
        `${method} ${path} failed (${res.status})`;
      throw new HttpError(res.status, message, payload);
    }
    return payload as T;
  }

  private buildUrl(path: string, query?: HttpRequestOptions['query']): string {
    const base = `${this.baseUrl}${path}`;
    if (!query) {
      return base;
    }
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue;
      }
      params.set(key, String(value));
    }
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }
}
