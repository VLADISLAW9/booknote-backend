import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Architecture' })
  title!: string;

  @ApiProperty({ example: 'Robert C. Martin' })
  author!: string;

  @ApiProperty({ example: 'Software Engineering' })
  genre!: string;

  @ApiProperty({ example: 432, minimum: 1 })
  totalPages!: number;

  @ApiPropertyOptional({ example: 120, minimum: 0, default: 0 })
  currentPage?: number;

  @ApiPropertyOptional({
    example: 'Читаю',
    enum: ['reading', 'read', 'not_read', 'Читаю', 'Прочитана', 'Не прочитана'],
    default: 'not_read',
  })
  readingStatus?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  cover?: string;

  @ApiPropertyOptional({ example: 'Book about software architecture.' })
  annotation?: string;

  @ApiPropertyOptional({ example: '2026-06-01' })
  startedAt?: string;

  @ApiPropertyOptional({ example: '2026-06-30' })
  finishedAt?: string;
}
