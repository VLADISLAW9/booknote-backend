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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBooksQueryDto } from './dto/get-books-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Get current user books' })
  @ApiResponse({ status: 200, description: 'Books returned.' })
  @ApiResponse({
    status: 401,
    description: 'Bearer token is missing or invalid.',
  })
  @Get()
  findAll(@Query() query: GetBooksQueryDto, @Req() request: Request) {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.booksService.findAll(user.id, query);
  }

  @ApiOperation({ summary: 'Get one current user book by id' })
  @ApiParam({ name: 'id', description: 'Book id' })
  @ApiResponse({ status: 200, description: 'Book returned.' })
  @ApiResponse({ status: 404, description: 'Book was not found.' })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.booksService.findOne(user.id, id);
  }

  @ApiOperation({ summary: 'Delete current user book by id' })
  @ApiParam({ name: 'id', description: 'Book id' })
  @ApiResponse({ status: 200, description: 'Book deleted.' })
  @ApiResponse({ status: 404, description: 'Book was not found.' })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.booksService.remove(user.id, id);
  }

  @ApiOperation({ summary: 'Partially update current user book by id' })
  @ApiParam({ name: 'id', description: 'Book id' })
  @ApiResponse({ status: 200, description: 'Book updated.' })
  @ApiResponse({ status: 404, description: 'Book was not found.' })
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

  @ApiOperation({ summary: 'Add a book to current user library' })
  @ApiResponse({ status: 201, description: 'Book created.' })
  @ApiResponse({ status: 400, description: 'Invalid book payload.' })
  @Post()
  create(@Body() dto: CreateBookDto, @Req() request: Request) {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.booksService.create(user.id, dto);
  }
}
