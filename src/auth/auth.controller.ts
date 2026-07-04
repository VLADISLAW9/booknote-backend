import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import {
  ApiWrappedErrorResponse,
  ApiWrappedSuccessResponse,
} from '../common/swagger/api-response.decorators';
import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  PublicUserResponseDto,
} from './dto/auth-response.dto';
import { extractCookieValue } from './auth-cookie';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedRequest } from './types/authenticated-request';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly accessTokenCookieName = 'accessToken';
  private readonly refreshTokenCookieName = 'refreshToken';

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiWrappedSuccessResponse({
    status: 201,
    description: 'User registered and JWT returned.',
    type: AuthResponseDto,
  })
  @ApiWrappedErrorResponse({
    status: 400,
    description: 'Email, password, or name is invalid.',
    example: 'Email, пароль или имя указаны некорректно',
  })
  @ApiWrappedErrorResponse({
    status: 409,
    description: 'User with this email already exists.',
    example: 'Пользователь с таким email уже существует',
  })
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResponse = await this.authService.register(dto);

    this.setAuthCookies(response, authResponse);

    return this.toPublicAuthResponse(authResponse);
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiWrappedSuccessResponse({
    status: 200,
    description: 'JWT returned.',
    type: AuthResponseDto,
  })
  @ApiWrappedErrorResponse({
    status: 400,
    description: 'Email or password format is invalid.',
    example: 'Формат email или пароля указан некорректно',
  })
  @ApiWrappedErrorResponse({
    status: 401,
    description: 'Invalid email or password.',
    example: 'Неверный email или пароль',
  })
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResponse = await this.authService.login(dto);

    this.setAuthCookies(response, authResponse);

    return this.toPublicAuthResponse(authResponse);
  }

  @ApiOperation({ summary: 'Refresh auth cookies using refresh cookie' })
  @ApiWrappedSuccessResponse({
    status: 200,
    description: 'New auth cookies returned.',
    type: AuthResponseDto,
  })
  @ApiWrappedErrorResponse({
    status: 401,
    description: 'Refresh token is missing or invalid.',
    example: 'Refresh token отсутствует или недействителен',
  })
  @HttpCode(200)
  @ApiCookieAuth('refreshToken')
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResponse = await this.authService.refresh(
      this.getRefreshTokenFromCookie(request),
    );

    this.setAuthCookies(response, authResponse);

    return this.toPublicAuthResponse(authResponse);
  }

  @ApiOperation({ summary: 'Logout and clear auth cookies' })
  @ApiWrappedSuccessResponse({
    status: 200,
    description: 'Auth cookies cleared.',
    nullable: true,
  })
  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    this.clearAccessTokenCookie(response);
    this.clearRefreshTokenCookie(response);

    return null;
  }

  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiWrappedSuccessResponse({
    status: 200,
    description: 'Current user returned.',
    type: PublicUserResponseDto,
  })
  @ApiWrappedErrorResponse({
    status: 401,
    description: 'Bearer token is missing or invalid.',
    example: 'Токен авторизации отсутствует или недействителен',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: Request) {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return user;
  }

  private setRefreshTokenCookie(
    response: Response,
    refreshToken: string,
  ): void {
    response.cookie(this.refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: this.isSecureCookieEnabled(),
      sameSite: this.getCookieSameSite(),
      maxAge: this.authService.getRefreshTokenMaxAgeMs(),
      path: '/api/auth/refresh',
    });
  }

  private setAccessTokenCookie(response: Response, accessToken: string): void {
    response.cookie(this.accessTokenCookieName, accessToken, {
      secure: this.isSecureCookieEnabled(),
      sameSite: this.getCookieSameSite(),
      maxAge: this.authService.getAccessTokenMaxAgeMs(),
      path: '/',
    });
  }

  private setAuthCookies(
    response: Response,
    authResponse: Awaited<ReturnType<AuthService['login']>>,
  ): void {
    this.setAccessTokenCookie(response, authResponse.accessToken);
    this.setRefreshTokenCookie(response, authResponse.refreshToken);
  }

  private clearAccessTokenCookie(response: Response): void {
    response.clearCookie(this.accessTokenCookieName, {
      secure: this.isSecureCookieEnabled(),
      sameSite: this.getCookieSameSite(),
      path: '/',
    });
  }

  private clearRefreshTokenCookie(response: Response): void {
    response.clearCookie(this.refreshTokenCookieName, {
      httpOnly: true,
      secure: this.isSecureCookieEnabled(),
      sameSite: this.getCookieSameSite(),
      path: '/api/auth/refresh',
    });
  }

  private getRefreshTokenFromCookie(request: Request): string | null {
    return extractCookieValue(request, this.refreshTokenCookieName);
  }

  private toPublicAuthResponse(
    authResponse: Awaited<ReturnType<AuthService['login']>>,
  ) {
    return {
      user: authResponse.user,
    };
  }

  private isSecureCookieEnabled(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  private getCookieSameSite(): 'lax' | 'none' {
    return this.isSecureCookieEnabled() ? 'none' : 'lax';
  }
}
