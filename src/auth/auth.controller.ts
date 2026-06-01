import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AuthenticatedRequest } from './types/authenticated-request';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered and JWT returned.',
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
  @ApiResponse({ status: 201, description: 'JWT returned.' })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user returned.' })
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
