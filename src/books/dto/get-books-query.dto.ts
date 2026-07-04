import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  READING_STATUS_VALUES,
  ReadingStatus,
} from '../enums/reading-status.enum';

export class GetBooksQueryDto {
  @ApiPropertyOptional({ example: 'architecture' })
  title?: string;

  @ApiPropertyOptional({
    example: ReadingStatus.Reading,
    enum: READING_STATUS_VALUES,
    enumName: 'ReadingStatus',
  })
  readingStatus?: ReadingStatus;

  @ApiPropertyOptional({ example: 'software' })
  genre?: string;
}
