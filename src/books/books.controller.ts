import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { BooksService } from './books.service';
import type { CreateBookDto } from './dto/create-book.dto';
import type { GetBooksQueryDto } from './dto/get-books-query.dto';
import type { UpdateBookDto } from './dto/update-book.dto';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@Query() query: GetBooksQueryDto, @Req() request: Request) {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.booksService.findAll(user.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.booksService.findOne(user.id, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.booksService.remove(user.id, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
    @Req() request: Request,
  ) {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.booksService.update(user.id, id, dto);
  }

  @Post()
  create(@Body() dto: CreateBookDto, @Req() request: Request) {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.booksService.create(user.id, dto);
  }
}
