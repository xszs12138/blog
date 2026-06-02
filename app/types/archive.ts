export interface ArchivePostRef {
  id: number;
  title: string;
  slug: string;
  cover: string;
  summary: string;
  viewCount: number;
  publishedAt: string;
}

export interface ArchiveMonth {
  month: number;
  posts: ArchivePostRef[];
}

export interface ArchiveYear {
  year: number;
  months: ArchiveMonth[];
}
