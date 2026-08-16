import type { RequestHandler } from 'express';

import { verifyAccessToken } from '../common/helpers/jwt.helper.js';
import { AppError } from '../common/errors/app-error.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';
import { ERROR_CODES } from '../common/constants/error-codes.js';

export const authMiddleware: RequestHandler = (
  req,
  _res,
  next,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(
      new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Unauthorized access',
      }),
    );
  }

const parts = authHeader.split(' ');

 if (parts.length !== 2 || parts[0] !== 'Bearer') {
  return next(
    new AppError({
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Invalid authorization header.',
    }),
  );
}
const token = parts[1];
if (!token) {
  return next(
    new AppError({
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Authorization token is missing.',
    }),
  );
}

  try {
    const payload = verifyAccessToken(token);

    req.user = {
       id: payload.sub,
    };

    next();
  } catch {
    next(
      new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Invalid token.',
      }),
    );
  }
};