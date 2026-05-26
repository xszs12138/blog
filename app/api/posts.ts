import type { PageParams, PageResult } from '~/types/api';
import type { PostDetail, PostListItem } from '~/types/post';

export interface GetPostsParams extends PageParams {
  categorySlug?: string;
  tagSlug?: string;
  keyword?: string;
}

export function usePostsApi() {
  const api = useApiClient();

  return {
    getPosts: (params?: GetPostsParams) =>
      api<PageResult<PostListItem>>('/web/posts', { query: params }),

    getPostBySlug: (slug: string) =>
      api<PostDetail>(`/web/posts/${encodeURIComponent(slug)}`),
  };
}
