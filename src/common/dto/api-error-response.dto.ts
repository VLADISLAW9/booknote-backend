import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({ enum: [false], example: false })
  success!: false;

  @ApiProperty({ example: 'Некорректные данные запроса' })
  error!: string;
}
