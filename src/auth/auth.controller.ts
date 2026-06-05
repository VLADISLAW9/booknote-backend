import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  AuthResponseDto,
  PublicUserResponseDto,
} from './dto/auth-response.dto';
import type { AuthenticatedRequest } from './types/authenticated-request';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User registered and JWT returned.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Email, password, or name is invalid.',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.',
  })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({ description: 'JWT returned.', type: AuthResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Email or password format is invalid.',
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({
    description: 'Current user returned.',
    type: PublicUserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Bearer token is missing or invalid.',
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
}
