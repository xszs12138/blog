import type { TagItem } from '~/types/tag';

export function useTagsApi() {
  const api = useApiClient();

  return {
    getTags: () => api<TagItem[]>('/web/tags'),
  };
}
