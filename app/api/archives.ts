import type { ArchiveYear } from '~/types/archive';

export function useArchivesApi() {
  const api = useApiClient();

  return {
    getArchives: () => api<ArchiveYear[]>('/web/archives'),
  };
}
