export interface PostCategoryRef {
  id: number;
  name: string;
  slug: string;
}

export interface PostTagRef {
  id: number;
  name: string;
  slug: string;
}

export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  cover: string;
  summary: string;
  isPinned: boolean;
  viewCount: number;
  publishedAt?: string;
  category?: PostCategoryRef;
  tags: PostTagRef[];
}

export interface PostNeighbor {
  title: string;
  slug: string;
}

export interface PostDetail extends PostListItem {
  content: string;
  contentType: string;
  prevPost?: PostNeighbor;
  nextPost?: PostNeighbor;
}
