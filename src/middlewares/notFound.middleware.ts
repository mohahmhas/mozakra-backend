import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../common/errors/app-error.js';
import { ERROR_CODES } from '../common/constants/error-codes.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';

export const notFoundMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction,
): void => {
  next(
    new AppError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODES.NOT_FOUND,
      message: `Route ${req.originalUrl} not found`,
    }),
  );
};