import { ApiProperty } from '@nestjs/swagger';

export class PublicUserResponseDto {
  @ApiProperty({ example: '9f242cb1-0f8e-4bd4-9c18-0e9e4d0c8a3f' })
  id!: string;

  @ApiProperty({ example: 'reader@example.com' })
  email!: string;

  @ApiProperty({ example: 'Reader Name' })
  name!: string;

  @ApiProperty({
    example: '2026-06-06T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for authenticated requests.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ type: PublicUserResponseDto })
  user!: PublicUserResponseDto;
}
