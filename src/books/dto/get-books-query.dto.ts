import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetBooksQueryDto {
  @ApiPropertyOptional({ example: 'architecture' })
  title?: string;

  @ApiPropertyOptional({
    example: 'reading',
    enum: ['reading', 'read', 'not_read', 'Читаю', 'Прочитана', 'Не прочитана'],
  })
  readingStatus?: string;

  @ApiPropertyOptional({ example: 'software' })
  genre?: string;
}
