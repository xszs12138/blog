import type { SiteInfo } from '~/types/site'

export function useSiteApi() {
  const api = useApiClient()

  return {
    getSite: () => api<SiteInfo>('/web/site'),
  }
}
