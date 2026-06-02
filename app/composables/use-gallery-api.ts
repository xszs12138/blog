import type { PageParams, PageResult } from '~/types/api'
import type { GalleryImage } from '~/types/gallery'

export interface GetGalleryImagesParams extends PageParams {
  albumId?: number
  order?: 'earliest' | 'least' | 'newest' | 'utmost'
}

export function useGalleryApi() {
  const api = useApiClient()

  return {
    getImages: (params?: GetGalleryImagesParams) =>
      api<PageResult<GalleryImage>>('/web/gallery/images', { query: params }),
  }
}
