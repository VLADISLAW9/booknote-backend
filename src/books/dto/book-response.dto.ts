import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReadingStatus } from '../enums/reading-status.enum';

export class BookResponseDto {
  @ApiProperty({ example: '9f242cb1-0f8e-4bd4-9c18-0e9e4d0c8a3f' })
  id!: string;

  @ApiProperty({ example: 'Clean Architecture' })
  title!: string;

  @ApiProperty({ example: 'Robert C. Martin' })
  author!: string;

  @ApiProperty({ example: 'Software Engineering' })
  genre!: string;

  @ApiProperty({ example: 432 })
  totalPages!: number;

  @ApiProperty({ example: 120 })
  currentPage!: number;

  @ApiProperty({
    enum: ReadingStatus,
    enumName: 'ReadingStatus',
    example: ReadingStatus.Reading,
  })
  readingStatus!: ReadingStatus;

  @ApiPropertyOptional({
    example: 'https://example.com/cover.jpg',
    nullable: true,
  })
  cover!: string | null;

  @ApiPropertyOptional({
    example: 'Book about software architecture.',
    nullable: true,
  })
  annotation!: string | null;

  @ApiPropertyOptional({
    example: '2026-06-01T00:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  startedAt!: Date | null;

  @ApiPropertyOptional({
    example: '2026-06-30T00:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  finishedAt!: Date | null;

  @ApiProperty({ example: '9f242cb1-0f8e-4bd4-9c18-0e9e4d0c8a3f' })
  userId!: string;

  @ApiProperty({
    example: '2026-06-06T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-06-06T10:30:00.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}
