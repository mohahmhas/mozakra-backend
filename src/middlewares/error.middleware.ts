import type {
  ErrorRequestHandler,
} from 'express';

import { Prisma } from '../generated/prisma/client.js';

import { logger } from '../config/logger.js';

import { AppError } from '../common/errors/app-error.js';

import { HTTP_STATUS } from '../common/constants/http-status.js';

import { ERROR_CODES } from '../common/constants/error-codes.js';

import { env } from '../config/env.js';

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  logger.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message:
      env.NODE_ENV === 'production'
        ? 'Something went wrong.'
        : error.message,
  });
};