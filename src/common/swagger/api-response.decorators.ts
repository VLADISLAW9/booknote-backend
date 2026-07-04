import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../dto/api-error-response.dto';

interface ApiSuccessResponseOptions<T extends Type<unknown>> {
  status: number;
  description: string;
  type?: T;
  isArray?: boolean;
  nullable?: boolean;
}

interface ApiErrorResponseOptions {
  status: number;
  description: string;
  example?: string;
}

export function ApiWrappedSuccessResponse<T extends Type<unknown>>(
  options: ApiSuccessResponseOptions<T>,
) {
  const decorators = [
    ApiResponse({
      status: options.status,
      description: options.description,
      schema: {
        type: 'object',
        required: ['success', 'data'],
        properties: {
          success: {
            type: 'boolean',
            enum: [true],
            example: true,
          },
          data: getDataSchema(options),
        },
      },
    }),
  ];

  if (options.type) {
    decorators.unshift(ApiExtraModels(options.type));
  }

  return applyDecorators(...decorators);
}

export function ApiWrappedErrorResponse(options: ApiErrorResponseOptions) {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ApiResponse({
      status: options.status,
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiErrorResponseDto) },
          {
            properties: {
              error: {
                type: 'string',
                example: options.example ?? 'Некорректные данные запроса',
              },
            },
          },
        ],
      },
    }),
  );
}

function getDataSchema<T extends Type<unknown>>(
  options: ApiSuccessResponseOptions<T>,
) {
  if (options.nullable) {
    return {
      nullable: true,
      example: null,
    };
  }

  if (!options.type) {
    return {};
  }

  if (options.isArray) {
    return {
      type: 'array',
      items: {
        $ref: getSchemaPath(options.type),
      },
    };
  }

  return {
    $ref: getSchemaPath(options.type),
  };
}
