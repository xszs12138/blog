export const HOME_POST_PAGE_SIZE = 5

/** 首页文章列表（分页） */
export function useHomePosts() {
  return usePostsList({
    pageSize: HOME_POST_PAGE_SIZE,
    keyPrefix: 'home-posts',
    scrollToPostsAnchor: true,
  })
}
