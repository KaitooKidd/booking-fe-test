import { getCookie } from 'cookies-next';
import { ApiResponse, FetcherMethod } from './instance.config';

export class FetchInstance<T = any> {
  private readonly controller: AbortController;

  constructor() {
    this.controller = new AbortController();
  }

  private transformUrl(url: string): string {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`; // API_BASE_URL does not include trailing slash
  }

  private async execute(url: string, method: FetcherMethod, init?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetcher(url, method, init);
      return { isSuccess: true, data: response };
    } catch (error) {
      return { isSuccess: false, error };
    }
  }

  async get(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
    return this.execute(url, 'GET', init);
  }

  async post(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
    return this.execute(url, 'POST', init);
  }

  async put(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
    return this.execute(url, 'PUT', init);
  }

  async delete(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
    return this.execute(url, 'DELETE', init);
  }

  async fetcher(url: string, method: FetcherMethod, init?: RequestInit): Promise<T> {
    const response = await fetch(this.transformUrl(url), {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      method,
      signal: this.controller.signal,
    });
    const data = await response.json();
    if (!response.ok || response.status >= 400) {
      // throw new Error(data.message || response.statusText || response.status.toString());
      throw { statusCode: response.status, message: data.message || response.statusText || response.status.toString() };
    }
    return data;
  }

  abort() {
    this.controller.abort();
  }
}

export class PrivateFetchInstance<T = any> extends FetchInstance<T> {
  async fetcher(url: string, method: FetcherMethod, init?: RequestInit): Promise<T> {
    const token = getCookie('token');
    if (!token) {
      throw new Error('No token found');
    }

    return super.fetcher(url, method, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
