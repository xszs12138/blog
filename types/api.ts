/** 与 docs/api-spec.md 统一响应结构一致 */
export interface HttpResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export interface PageResult<T> {
  items: T[];
  total: number;
}

export interface PageParams {
  page?: number;
  pageSize?: number;
}
