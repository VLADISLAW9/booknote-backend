import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'reader@example.com' })
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  password!: string;
}
