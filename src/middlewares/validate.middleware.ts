import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { AppError } from '../common/errors/app-error.js';
import { ERROR_CODES } from '../common/constants/error-codes.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';

interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
  headers?: ZodType;
}

export const validate =
  (schemas: ValidationSchemas): RequestHandler =>
  (req, _res, next) => {
   
    const locations = [
      ['body', req.body],
      ['query', req.query],
      ['params', req.params],
      ['headers', req.headers],
    ] as const;

    for (const [key, value] of locations) {
      const schema = schemas[key];

      if (!schema) {
        continue;
      }

      const result = schema.safeParse(value);

      if (!result.success) {
        return next(
          new AppError({
            statusCode: HTTP_STATUS.BAD_REQUEST,
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Validation failed',
            details: result.error.flatten(),
          }),
        );
      }

      req[key] = result.data;
    }

    next();
  };