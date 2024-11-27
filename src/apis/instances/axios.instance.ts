// import { getCookie } from 'cookies-next';
// import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
// import queryString from 'query-string';

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// const axiosPrivateInstance = axios.create({
//   baseURL,
//   paramsSerializer: {
//     encode: (params) => queryString.stringify(params),
//   },
// });

// const axiosPublicInstance = axios.create({
//   baseURL,
//   paramsSerializer: {
//     encode: (params) => queryString.stringify(params),
//   },
// });

// /** Interceptors */
// axiosPrivateInstance.interceptors.request.use(
//   (config) => ({
//     ...config,
//     headers: {
//       ...config.headers,
//       'Content-Type': config.headers['Content-Type'] || 'application/json',
//       Authorization: `Bearer ${getCookie('token')}`,
//     } as AxiosRequestHeaders,
//   }),
//   (error) => {
//     // return Promise.reject(error);
//     throw error.response.data;
//   },
// );

// axiosPrivateInstance.interceptors.response.use(
//   (response) => {
//     if (response && response.data) return response.data;
//     return response;
//   },
//   (error) => {
//     // return Promise.reject(error);
//     throw error.response.data;
//   },
// );

// axiosPublicInstance.interceptors.request.use(
//   (config) => ({
//     ...config,
//     headers: {
//       ...config.headers,
//       'Content-Type': config.headers['Content-Type'] || 'application/json',
//     } as AxiosRequestHeaders,
//   }),
//   (error) => {
//     // return Promise.reject(error);
//     throw error.response.data;
//   },
// );

// axiosPublicInstance.interceptors.response.use(
//   (response) => {
//     if (response && response.data) return response.data;
//     return response;
//   },
//   (error) => {
//     // return Promise.reject(error);
//     throw error.response.data;
//   },
// );

// export { axiosPrivateInstance, axiosPublicInstance };

import { getCookie } from 'cookies-next';
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import queryString from 'query-string';
import { ApiResponse } from './instance.config';

export class AxiosInstance {
  private instance;

  constructor(privateURL: boolean) {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      paramsSerializer: {
        encode: (params) => queryString.stringify(params),
      },
    });

    this.instance.interceptors.request.use(
      (config) => ({
        ...config,
        headers: {
          ...(config.headers && config.headers),
          'Content-Type':
            config.headers && config.headers['Content-Type'] ? config.headers['Content-Type'] : 'application/json',
          ...(privateURL && { Authorization: `Bearer ${getCookie('token')}` }),
        } as AxiosRequestHeaders,
      }),
      (error) => {
        // return Promise.reject(error);
        throw error.response.data;
      },
    );

    this.instance.interceptors.response.use(
      (response) => {
        if (response && response.data) return response.data;
        return response;
      },
      (error) => {
        // return Promise.reject(error);
        throw error.response.data;
      },
    );
  }

  private transformUrl(url: string): string {
    return `${url.startsWith('/') ? url : `/${url}`}`; // API_BASE_URL does not include trailing slash
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = (await this.instance.get(this.transformUrl(url), config)) as T;
      return { isSuccess: true, data: response };
    } catch (error) {
      return { isSuccess: false, error };
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = (await this.instance.post(this.transformUrl(url), data, config)) as T;
      return { isSuccess: true, data: response };
    } catch (error) {
      return { isSuccess: false, error };
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = (await this.instance.put(this.transformUrl(url), data, config)) as T;
      return { isSuccess: true, data: response };
    } catch (error) {
      return { isSuccess: false, error };
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = (await this.instance.patch(this.transformUrl(url), data, config)) as T;
      return { isSuccess: true, data: response };
    } catch (error) {
      return { isSuccess: false, error };
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = (await this.instance.delete(this.transformUrl(url), config)) as T;
      return { isSuccess: true, data: response };
    } catch (error) {
      return { isSuccess: false, error };
    }
  }
}

export const axiosPublicInstance = new AxiosInstance(false);
export const axiosPrivateInstance = new AxiosInstance(true);
