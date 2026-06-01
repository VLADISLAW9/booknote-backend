export interface CreateBookDto {
  title: string;
  author: string;
  genre: string;
  totalPages: number;
  currentPage?: number;
  readingStatus?: string;
  cover?: string;
  annotation?: string;
  startedAt?: string;
  finishedAt?: string;
}
