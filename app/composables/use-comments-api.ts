import type {
  CommentItem,
  CreateCommentParams,
  CreateCommentResult,
} from '~/types/comment'

export function useCommentsApi() {
  const api = useApiClient()

  return {
    getCommentsByPostSlug: (slug: string) =>
      api<CommentItem[]>(
        `/web/posts/${encodeURIComponent(slug)}/comments`,
      ),

    createComment: (slug: string, body: CreateCommentParams) =>
      api<CreateCommentResult>(
        `/web/posts/${encodeURIComponent(slug)}/comments`,
        {
          method: 'POST',
          body,
        },
      ),
  }
}
