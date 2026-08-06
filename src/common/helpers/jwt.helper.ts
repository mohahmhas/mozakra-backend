  import jwt from "jsonwebtoken";

  import { env } from '../../config/env.js';

  // export interface JwtPayload {
  //   userId: string;
  // }
  export interface AccessTokenPayload {
    userId: string;
  }

  export interface RefreshTokenPayload {
    userId: string;
    sessionId: string;
  }


  export const generateAccessToken = (
    payload: AccessTokenPayload,
  ): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
  };

  export const generateRefreshToken = (
    payload: RefreshTokenPayload,
  ): string => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
  };

  export const verifyAccessToken = (
    token: string,
  ): AccessTokenPayload => {
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (typeof payload === 'string') {
      throw new Error('Invalid token payload.');
    }

    return payload as AccessTokenPayload;
  };

  export const verifyRefreshToken = (
    token: string,
  ): RefreshTokenPayload => {
    const payload = jwt.verify(
      token,
      env.JWT_REFRESH_SECRET,
    );

    if (typeof payload === 'string') {
      throw new Error('Invalid token payload.');
    }

   const {
    userId,
    sessionId,
} = payload;

return {
    userId,
    sessionId,
};
  };