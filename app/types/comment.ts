export interface CommentReply {
  id: number;
  nickname: string;
  website?: string;
  content: string;
  createdAt: string;
}

export interface CommentItem {
  id: number;
  nickname: string;
  website?: string;
  content: string;
  createdAt: string;
  replies: CommentReply[];
}

export interface CreateCommentParams {
  nickname: string;
  email?: string;
  website?: string;
  content: string;
  parentId?: number | null;
}

export interface CreateCommentResult {
  id: number;
  status: string;
}
