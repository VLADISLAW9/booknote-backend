import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, ReadingStatus } from './book.entity';
import type { CreateBookDto } from './dto/create-book.dto';
import type { GetBooksQueryDto } from './dto/get-books-query.dto';
import type { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async create(userId: string, dto: CreateBookDto): Promise<Book> {
    const input = this.validateCreateBookDto(dto);
    const book = this.booksRepository.create({
      ...input,
      userId,
    });

    return this.booksRepository.save(book);
  }

  async findAll(userId: string, query: GetBooksQueryDto): Promise<Book[]> {
    const queryBuilder = this.booksRepository
      .createQueryBuilder('book')
      .where('book.userId = :userId', { userId })
      .orderBy('book.createdAt', 'DESC');

    const title = this.optionalString(query.title);
    const genre = this.optionalString(query.genre);

    if (title) {
      queryBuilder.andWhere('LOWER(book.title) LIKE :title', {
        title: `%${title.toLowerCase()}%`,
      });
    }

    if (genre) {
      queryBuilder.andWhere('LOWER(book.genre) LIKE :genre', {
        genre: `%${genre.toLowerCase()}%`,
      });
    }

    if (query.readingStatus) {
      queryBuilder.andWhere('book.readingStatus = :readingStatus', {
        readingStatus: this.normalizeReadingStatus(query.readingStatus),
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(userId: string, id: string): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!book) {
      throw new NotFoundException('Book was not found');
    }

    return book;
  }

  async remove(userId: string, id: string): Promise<void> {
    const result = await this.booksRepository.delete({
      id,
      userId,
    });

    if (!result.affected) {
      throw new NotFoundException('Book was not found');
    }
  }

  async update(userId: string, id: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(userId, id);
    const updates = this.validateUpdateBookDto(dto, book);

    Object.assign(book, updates);

    return this.booksRepository.save(book);
  }

  private validateCreateBookDto(dto: CreateBookDto) {
    const title = this.requiredString(dto.title, 'Title');
    const author = this.requiredString(dto.author, 'Author');
    const genre = this.requiredString(dto.genre, 'Genre');
    const totalPages = this.requiredPositiveInteger(
      dto.totalPages,
      'Total pages',
    );
    const currentPage = this.optionalNonNegativeInteger(
      dto.currentPage,
      'Current page',
    );

    if (currentPage > totalPages) {
      throw new BadRequestException(
        'Current page cannot be greater than total pages',
      );
    }

    return {
      title,
      author,
      genre,
      totalPages,
      currentPage,
      readingStatus: this.normalizeReadingStatus(dto.readingStatus),
      cover: this.optionalString(dto.cover),
      annotation: this.optionalString(dto.annotation),
      startedAt: this.optionalDate(dto.startedAt, 'Started at'),
      finishedAt: this.optionalDate(dto.finishedAt, 'Finished at'),
    };
  }

  private validateUpdateBookDto(dto: UpdateBookDto, book: Book) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('At least one book field is required');
    }

    const updates: Partial<Book> = {};

    if (dto.title !== undefined) {
      updates.title = this.requiredString(dto.title, 'Title');
    }

    if (dto.author !== undefined) {
      updates.author = this.requiredString(dto.author, 'Author');
    }

    if (dto.genre !== undefined) {
      updates.genre = this.requiredString(dto.genre, 'Genre');
    }

    if (dto.totalPages !== undefined) {
      updates.totalPages = this.requiredPositiveInteger(
        dto.totalPages,
        'Total pages',
      );
    }

    if (dto.currentPage !== undefined) {
      updates.currentPage = this.optionalNonNegativeInteger(
        dto.currentPage,
        'Current page',
      );
    }

    const nextTotalPages = updates.totalPages ?? book.totalPages;
    const nextCurrentPage = updates.currentPage ?? book.currentPage;

    if (nextCurrentPage > nextTotalPages) {
      throw new BadRequestException(
        'Current page cannot be greater than total pages',
      );
    }

    if (dto.readingStatus !== undefined) {
      updates.readingStatus = this.normalizeReadingStatus(dto.readingStatus);
    }

    if (dto.cover !== undefined) {
      updates.cover = this.optionalString(dto.cover);
    }

    if (dto.annotation !== undefined) {
      updates.annotation = this.optionalString(dto.annotation);
    }

    if (dto.startedAt !== undefined) {
      updates.startedAt = this.optionalDate(dto.startedAt, 'Started at');
    }

    if (dto.finishedAt !== undefined) {
      updates.finishedAt = this.optionalDate(dto.finishedAt, 'Finished at');
    }

    return updates;
  }

  private requiredString(value: unknown, fieldName: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required`);
    }

    return value.trim();
  }

  private optionalString(value: unknown): string | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('Optional text fields must be strings');
    }

    return value.trim();
  }

  private requiredPositiveInteger(value: unknown, fieldName: string): number {
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }

    return value;
  }

  private optionalNonNegativeInteger(
    value: unknown,
    fieldName: string,
  ): number {
    if (value === undefined || value === null) {
      return 0;
    }

    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      throw new BadRequestException(
        `${fieldName} must be a non-negative integer`,
      );
    }

    return value;
  }

  private normalizeReadingStatus(value: unknown): ReadingStatus {
    if (value === undefined || value === null || value === '') {
      return ReadingStatus.NotRead;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('Reading status must be a string');
    }

    const normalizedValue = value.trim().toLowerCase();
    const statuses: Record<string, ReadingStatus> = {
      reading: ReadingStatus.Reading,
      read: ReadingStatus.Read,
      not_read: ReadingStatus.NotRead,
      читаю: ReadingStatus.Reading,
      прочитана: ReadingStatus.Read,
      'не прочитана': ReadingStatus.NotRead,
    };
    const status = statuses[normalizedValue];

    if (!status) {
      throw new BadRequestException(
        'Reading status must be one of: reading, read, not_read',
      );
    }

    return status;
  }

  private optionalDate(value: unknown, fieldName: string): Date | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException(`${fieldName} must be an ISO date string`);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${fieldName} must be a valid date`);
    }

    return date;
  }
}
