export interface ArchivePostRef {
  id: number;
  title: string;
  slug: string;
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
