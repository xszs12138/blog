export interface WebSiteInfo {
  id: number
  name: string
  description: string
  logo: string
  icp: string
  about: string
  socialLinks: Array<{
    name: string
    url: string
  }>
}

export function useSiteApi() {
  const api = useApiClient()

  return {
    getSite: () => api<WebSiteInfo>('/web/site'),
  }
}
