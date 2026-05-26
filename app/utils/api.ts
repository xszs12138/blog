import type { FetchOptions, FetchResponse } from 'ofetch';

import type { HttpResponse } from '~/types/api';

export class ApiError extends Error {
  readonly code: number;
  readonly statusCode?: number;

  constructor(code: number, message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export type ApiClient = <T>(
  url: string,
  options?: FetchOptions,
) => Promise<T>;

function isHttpResponse(value: unknown): value is HttpResponse {
  return (
    typeof value === 'object'
    && value !== null
    && 'code' in value
    && 'data' in value
    && 'message' in value
  );
}

function unwrapResponse<T>(response: FetchResponse<unknown>): T {
  const body = response._data;

  if (!isHttpResponse(body)) {
    return body as T;
  }

  if (body.code !== 0) {
    throw new ApiError(
      body.code,
      body.message || '请求失败',
      response.status,
    );
  }

  return body.data as T;
}

function throwApiErrorFromResponse(response: FetchResponse<unknown>): never {
  const body = response._data;

  if (isHttpResponse(body)) {
    throw new ApiError(
      body.code,
      body.message || '请求失败',
      response.status,
    );
  }

  throw new ApiError(
    response.status,
    response.statusText || '网络错误',
    response.status,
  );
}

/** 创建博客端 API 客户端（baseURL 通常为 `/api` 或 SSR 用的绝对地址） */
export function createApiClient(baseURL: string): ApiClient {
  const fetcher = $fetch.create({
    baseURL,
    headers: {
      Accept: 'application/json',
    },
    onResponse({ response }) {
      response._data = unwrapResponse(response);
    },
    onResponseError({ response }) {
      throwApiErrorFromResponse(response);
    },
  });

  return <T>(url: string, options?: FetchOptions) =>
    fetcher<T>(url, options);
}
