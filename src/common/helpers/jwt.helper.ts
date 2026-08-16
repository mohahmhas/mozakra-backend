  import jwt from "jsonwebtoken";

  import { env } from '../../config/env.js';

  // export interface JwtPayload {
  //   userId: string;
  // }
  export interface AccessTokenPayload {
    userId: string;
  }

  // export interface RefreshTokenPayload {
  //   userId: string;
  //   sessionId: string;
  // }

  export interface RefreshTokenPayload {
    sub: string;
    sessionId: string;
    jti: string;
  } 

 export const generateAccessToken = (
  payload: Omit<AccessTokenPayload, "jti">,
): string => {
  return jwt.sign(
    {
      ...payload,
      jti: crypto.randomUUID(),
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  );
};


  export const generateRefreshToken = (
    payload: Omit<RefreshTokenPayload, "jti">,
  ): string => {
    return jwt.sign(
      {
        ...payload,
        jti: crypto.randomUUID(),
      },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      }
    );
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

    return payload as RefreshTokenPayload;    
  };