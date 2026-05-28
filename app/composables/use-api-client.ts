import { createApiClient } from "~/utils/common/api";

/**
 * 获取当前环境（SSR / 浏览器）下的 API 客户端。
 * 仅在 setup、插件、middleware 或 useAsyncData 回调中使用。
 */
export function useApiClient() {
  const config = useRuntimeConfig();
  const baseURL = import.meta.server
    ? String(config.apiBase)
    : String(config.public.apiBase);

  return createApiClient(baseURL);
}
