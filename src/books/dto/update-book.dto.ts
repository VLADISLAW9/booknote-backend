import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  READING_STATUS_VALUES,
  ReadingStatus,
} from '../enums/reading-status.enum';

export class UpdateBookDto {
  @ApiPropertyOptional({ example: 'Clean Architecture' })
  title?: string;

  @ApiPropertyOptional({ example: 'Robert C. Martin' })
  author?: string;

  @ApiPropertyOptional({ example: 'Software Engineering' })
  genre?: string;

  @ApiPropertyOptional({ example: 432, minimum: 1 })
  totalPages?: number;

  @ApiPropertyOptional({ example: 120, minimum: 0 })
  currentPage?: number;

  @ApiPropertyOptional({
    example: ReadingStatus.Read,
    enum: READING_STATUS_VALUES,
    enumName: 'ReadingStatus',
  })
  readingStatus?: ReadingStatus;

  @ApiPropertyOptional({
    example: 'https://example.com/cover.jpg',
    nullable: true,
  })
  cover?: string | null;

  @ApiPropertyOptional({
    example: 'Book about software architecture.',
    nullable: true,
  })
  annotation?: string | null;

  @ApiPropertyOptional({ example: '2026-06-01', nullable: true })
  startedAt?: string | null;

  @ApiPropertyOptional({ example: '2026-06-30', nullable: true })
  finishedAt?: string | null;
}
