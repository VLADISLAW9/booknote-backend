import type { LoginDto } from './login.dto';

export interface RegisterDto extends LoginDto {
  name: string;
}
