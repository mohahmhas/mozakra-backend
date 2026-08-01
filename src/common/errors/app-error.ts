import { HTTP_STATUS } from '../constants/http-status.js';
import type { ErrorCode } from '../constants/error-codes.js';

interface AppErrorOptions {
  statusCode: number;

  code: ErrorCode;

  message: string;

  isOperational?: boolean;

  details?: unknown;
}

export class AppError extends Error {
  public readonly statusCode: number;

  public readonly code: ErrorCode;

  public readonly isOperational: boolean;

  public readonly details?: unknown;

  constructor({
    statusCode,
    code,
    message,
    isOperational = true,
    details,
  }: AppErrorOptions) {
    super(message);

    this.name = this.constructor.name;

    this.statusCode = statusCode;

    this.code = code;

    this.isOperational = isOperational;

    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  static internal(message = 'Internal Server Error') {
    return new AppError({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message,
    });
  }
}