export interface UpdateBookDto {
  title?: string;
  author?: string;
  genre?: string;
  totalPages?: number;
  currentPage?: number;
  readingStatus?: string;
  cover?: string | null;
  annotation?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
}
