import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { JwtService } from './jwt.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    this.validateRegisterDto(dto);

    const email = dto.email.trim().toLowerCase();
    const existingUser = this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const user = this.usersService.create({
      email,
      name: dto.name.trim(),
      passwordHash,
    });

    return this.createAuthResponse(user);
  }

  async login(dto: LoginDto) {
    this.validateLoginDto(dto);

    const email = dto.email.trim().toLowerCase();
    const user = this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordService.verify(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createAuthResponse(user);
  }

  private createAuthResponse(user: User) {
    const publicUser = this.usersService.toPublicUser(user);
    const accessToken = this.jwtService.sign({
      sub: publicUser.id,
      email: publicUser.email,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      user: publicUser,
    };
  }

  private validateRegisterDto(dto: RegisterDto): void {
    this.validateLoginDto(dto);

    if (typeof dto.name !== 'string' || dto.name.trim().length < 2) {
      throw new BadRequestException('Name must contain at least 2 characters');
    }
  }

  private validateLoginDto(dto: LoginDto): void {
    if (!dto || typeof dto.email !== 'string' || !this.isEmail(dto.email)) {
      throw new BadRequestException('A valid email is required');
    }

    if (typeof dto.password !== 'string' || dto.password.length < 8) {
      throw new BadRequestException(
        'Password must contain at least 8 characters',
      );
    }
  }

  private isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }
}
