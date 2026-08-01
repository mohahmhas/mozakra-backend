import jwt from "jsonwebtoken";

import { env } from '../../config/env.js';

export interface JwtPayload {
  userId: string;
}

export const generateAccessToken = (
  payload: JwtPayload,
): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (
  payload: JwtPayload,
): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (
  token: string,
): JwtPayload => {
  return jwt.verify(
    token,
    env.JWT_SECRET,
  ) as JwtPayload;
};

export const verifyRefreshToken = (
  token: string,
): JwtPayload => {
  const payload = jwt.verify(
  token,
  env.JWT_SECRET,
);
if (typeof payload === 'string') {
  throw new Error('Invalid token payload.');
}

return payload as JwtPayload;
};