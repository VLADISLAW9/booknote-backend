import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

interface HttpExceptionBody {
  message?: string | string[];
  error?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      throw exception;
    }

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      success: false,
      error: this.getRussianErrorMessage(exception, status),
    } satisfies ApiErrorResponse);
  }

  private getRussianErrorMessage(exception: unknown, status: number): string {
    if (!(exception instanceof HttpException)) {
      return 'Внутренняя ошибка сервера';
    }

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return this.translateMessage(exceptionResponse, status);
    }

    if (this.isHttpExceptionBody(exceptionResponse)) {
      const message = exceptionResponse.message ?? exceptionResponse.error;

      if (Array.isArray(message)) {
        return this.translateValidationMessages(message, status);
      }

      if (message) {
        return this.translateMessage(message, status);
      }
    }

    return this.getDefaultMessage(status);
  }

  private isHttpExceptionBody(value: unknown): value is HttpExceptionBody {
    return typeof value === 'object' && value !== null;
  }

  private translateValidationMessages(
    messages: string[],
    status: number,
  ): string {
    const russianMessages = messages.filter((message) =>
      this.containsCyrillic(message),
    );

    if (russianMessages.length > 0) {
      return russianMessages.join('; ');
    }

    return status === 400
      ? 'Некорректные данные запроса'
      : this.getDefaultMessage(status);
  }

  private translateMessage(message: string, status: number): string {
    if (this.containsCyrillic(message)) {
      return message;
    }

    const translations: Record<string, string> = {
      'A valid email is required': 'Укажите корректный email',
      'Access token is required': 'Access token отсутствует',
      'At least one book field is required':
        'Укажите хотя бы одно поле книги для изменения',
      'Author is required': 'Укажите автора книги',
      'Bearer token is missing or invalid.':
        'Токен авторизации отсутствует или недействителен',
      'Book was not found': 'Книга не найдена',
      'Current page cannot be greater than total pages':
        'Текущая страница не может быть больше общего количества страниц',
      'Current page must be a non-negative integer':
        'Текущая страница должна быть неотрицательным целым числом',
      'Email, password, or name is invalid.':
        'Email, пароль или имя указаны некорректно',
      'Email or password format is invalid.':
        'Формат email или пароля указан некорректно',
      'Finished at must be a valid date':
        'Дата завершения чтения должна быть корректной',
      'Finished at must be an ISO date string':
        'Дата завершения чтения должна быть строкой в формате ISO',
      'Genre is required': 'Укажите жанр книги',
      'Invalid book payload.': 'Данные книги указаны некорректно',
      'Invalid email or password': 'Неверный email или пароль',
      'Invalid access token': 'Access token недействителен',
      'Invalid auth cookie': 'Cookie авторизации недействительна',
      'Invalid refresh token': 'Refresh token недействителен',
      'Invalid token': 'Токен недействителен',
      'Invalid token payload': 'Данные токена недействительны',
      'Invalid token signature': 'Подпись токена недействительна',
      'Name must contain at least 2 characters':
        'Имя должно содержать минимум 2 символа',
      'Optional text fields must be strings':
        'Необязательные текстовые поля должны быть строками',
      'Password must contain at least 8 characters':
        'Пароль должен содержать минимум 8 символов',
      'Reading status must be a string': 'Статус чтения должен быть строкой',
      'Reading status must be one of: Читаю, Прочитано, Не прочитано':
        'Статус чтения должен быть одним из: Читаю, Прочитано, Не прочитано',
      'Refresh token is missing or invalid.':
        'Refresh token отсутствует или недействителен',
      'Refresh token is required': 'Refresh token отсутствует',
      'Started at must be a valid date':
        'Дата начала чтения должна быть корректной',
      'Started at must be an ISO date string':
        'Дата начала чтения должна быть строкой в формате ISO',
      'Title is required': 'Укажите название книги',
      'Total pages must be a positive integer':
        'Общее количество страниц должно быть положительным целым числом',
      'Token has expired': 'Срок действия токена истек',
      'User is not authenticated': 'Пользователь не авторизован',
      'User no longer exists': 'Пользователь больше не существует',
      'User with this email already exists':
        'Пользователь с таким email уже существует',
    };

    return translations[message] ?? this.getDefaultMessage(status);
  }

  private getDefaultMessage(status: number): string {
    const defaultMessages: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Некорректный запрос',
      [HttpStatus.UNAUTHORIZED]: 'Необходима авторизация',
      [HttpStatus.FORBIDDEN]: 'Доступ запрещен',
      [HttpStatus.NOT_FOUND]: 'Ресурс не найден',
      [HttpStatus.CONFLICT]: 'Конфликт данных',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Некорректные данные запроса',
    };

    return defaultMessages[status] ?? 'Внутренняя ошибка сервера';
  }

  private containsCyrillic(value: string): boolean {
    return /[А-Яа-яЁё]/.test(value);
  }
}
